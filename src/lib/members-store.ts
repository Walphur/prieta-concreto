import { promises as fs } from "fs";
import path from "path";
import { del, list, put } from "@vercel/blob";
import type { Member } from "@/types/member";

const DATA_PATH = path.join(process.cwd(), "data", "members.json");
const BLOB_VERSION_PREFIX = "members/v/";
const BLOB_HEAD_PATH = "members/head.json";
const MAX_VERSIONS = 15;

const STORAGE_UNAVAILABLE_ES =
  "No pudimos guardar tu acceso ahora. Probá de nuevo en unos minutos.";

function useBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** Local JSON only on a writable machine (never on Vercel / production). */
function useLocalFile() {
  if (process.env.VERCEL) return false;
  if (process.env.NODE_ENV === "production") return false;
  return true;
}

type HeadPointer = { url: string; pathname: string; updatedAt: string };

function friendlyStorageError(error: unknown): Error {
  const message = error instanceof Error ? error.message : String(error);
  if (
    /EROFS|read-only|suspended|BLOB_READ_WRITE_TOKEN|not configured|ENOENT|EACCES/i.test(
      message,
    )
  ) {
    return new Error(STORAGE_UNAVAILABLE_ES);
  }
  if (/Vercel Blob/i.test(message)) {
    return new Error(STORAGE_UNAVAILABLE_ES);
  }
  return error instanceof Error ? error : new Error(STORAGE_UNAVAILABLE_ES);
}

async function readLocal(): Promise<Member[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    return JSON.parse(raw) as Member[];
  } catch {
    return [];
  }
}

async function writeLocal(members: Member[]) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(members, null, 2), "utf8");
}

async function fetchJson(url: string): Promise<Member[] | null> {
  const res = await fetch(
    `${url}${url.includes("?") ? "&" : "?"}_=${Date.now()}`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  return (await res.json()) as Member[];
}

async function readBlob(): Promise<Member[] | null> {
  try {
    const { blobs: heads } = await list({ prefix: BLOB_HEAD_PATH, limit: 5 });
    const headBlob = heads.find((b) => b.pathname === BLOB_HEAD_PATH);
    if (headBlob) {
      const head = (await fetch(`${headBlob.url}?_=${Date.now()}`, {
        cache: "no-store",
      }).then((r) => (r.ok ? r.json() : null))) as HeadPointer | null;
      if (head?.url) {
        const data = await fetchJson(head.url);
        if (data) return data;
      }
    }

    const { blobs } = await list({ prefix: BLOB_VERSION_PREFIX, limit: 50 });
    if (!blobs.length) return null;
    const newest = [...blobs].sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    )[0];
    return fetchJson(newest.url);
  } catch {
    return null;
  }
}

async function writeBlob(members: Member[]) {
  const pathname = `${BLOB_VERSION_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 7)}.json`;
  const blob = await put(pathname, JSON.stringify(members, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    cacheControlMaxAge: 60 * 60 * 24 * 30,
  });

  await put(
    BLOB_HEAD_PATH,
    JSON.stringify({
      url: blob.url,
      pathname: blob.pathname,
      updatedAt: new Date().toISOString(),
    } satisfies HeadPointer),
    {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    },
  );

  try {
    const { blobs } = await list({ prefix: BLOB_VERSION_PREFIX, limit: 80 });
    if (blobs.length > MAX_VERSIONS) {
      const sorted = [...blobs].sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
      );
      await del(sorted.slice(MAX_VERSIONS).map((b) => b.url));
    }
  } catch {
    /* ignore prune */
  }
}

export type MembersStorageInfo = {
  mode: "blob" | "local" | "cookie-only";
  blobConfigured: boolean;
  localDev: boolean;
};

export function getMembersStorageInfo(): MembersStorageInfo {
  const blobConfigured = useBlob();
  const localDev = useLocalFile();
  return {
    blobConfigured,
    localDev,
    mode: blobConfigured ? "blob" : localDev ? "local" : "cookie-only",
  };
}

export async function readMembers(): Promise<Member[]> {
  if (useBlob()) {
    const fromBlob = await readBlob();
    if (fromBlob) return fromBlob;
  }
  if (useLocalFile()) return readLocal();
  return [];
}

/**
 * Persist members when durable storage is available.
 * Returns false when nothing was written (caller should rely on signed cookie).
 */
export async function writeMembers(members: Member[]): Promise<boolean> {
  if (useBlob()) {
    try {
      await writeBlob(members);
      return true;
    } catch (error) {
      // Suspended / missing store: fall through to local (dev) or cookie-only.
      if (!useLocalFile()) {
        throw friendlyStorageError(error);
      }
    }
  }

  if (useLocalFile()) {
    try {
      await writeLocal(members);
      return true;
    } catch (error) {
      throw friendlyStorageError(error);
    }
  }

  // Production without Blob: cookie is the durable session store.
  return false;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function upsertMember(
  input: {
    email: string;
    name?: string;
  },
  cookieMember?: Member | null,
): Promise<{ member: Member; persisted: boolean }> {
  const email = normalizeEmail(input.email);
  const name = input.name?.trim() || undefined;
  const members = await readMembers();
  const existing = members.find((m) => m.email === email);
  const sameCookie =
    cookieMember && normalizeEmail(cookieMember.email) === email
      ? cookieMember
      : null;

  if (existing) {
    let dirty = false;
    if (name && name !== existing.name) {
      existing.name = name;
      dirty = true;
    }
    if (sameCookie?.firstDiscountUsed && !existing.firstDiscountUsed) {
      existing.firstDiscountUsed = true;
      existing.firstDiscountUsedAt =
        sameCookie.firstDiscountUsedAt || new Date().toISOString();
      dirty = true;
    }
    if (dirty) {
      try {
        const persisted = await writeMembers(members);
        return { member: existing, persisted };
      } catch {
        return { member: existing, persisted: false };
      }
    }
    return { member: existing, persisted: true };
  }

  const member: Member = {
    email,
    name: name || sameCookie?.name,
    createdAt: sameCookie?.createdAt || new Date().toISOString(),
    firstDiscountUsed: Boolean(sameCookie?.firstDiscountUsed),
    firstDiscountUsedAt: sameCookie?.firstDiscountUsedAt,
  };
  members.unshift(member);

  try {
    const persisted = await writeMembers(members);
    return { member, persisted };
  } catch {
    // No Blob / read-only FS: signup still succeeds via signed cookie.
    return { member, persisted: false };
  }
}

export async function getMemberByEmail(
  email: string,
): Promise<Member | undefined> {
  const normalized = normalizeEmail(email);
  const members = await readMembers();
  return members.find((m) => m.email === normalized);
}

export async function markFirstDiscountUsed(
  email: string,
  fallback?: Member | null,
): Promise<{ member: Member; persisted: boolean } | null> {
  const normalized = normalizeEmail(email);
  const members = await readMembers();
  let member = members.find((m) => m.email === normalized);

  if (!member && fallback && normalizeEmail(fallback.email) === normalized) {
    member = { ...fallback, email: normalized };
    members.unshift(member);
  }

  if (!member) return null;

  if (!member.firstDiscountUsed) {
    member.firstDiscountUsed = true;
    member.firstDiscountUsedAt =
      member.firstDiscountUsedAt || new Date().toISOString();
    try {
      const persisted = await writeMembers(members);
      return { member, persisted };
    } catch {
      return { member, persisted: false };
    }
  }

  return { member, persisted: true };
}

export { STORAGE_UNAVAILABLE_ES };
