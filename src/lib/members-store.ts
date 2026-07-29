import { promises as fs } from "fs";
import path from "path";
import { del, list, put } from "@vercel/blob";
import type { Member } from "@/types/member";

const DATA_PATH = path.join(process.cwd(), "data", "members.json");
const BLOB_VERSION_PREFIX = "members/v/";
const BLOB_HEAD_PATH = "members/head.json";
const MAX_VERSIONS = 15;

function useBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

type HeadPointer = { url: string; pathname: string; updatedAt: string };

async function readLocal(): Promise<Member[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    return JSON.parse(raw) as Member[];
  } catch {
    return [];
  }
}

async function writeLocal(members: Member[]) {
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

export async function readMembers(): Promise<Member[]> {
  if (useBlob()) {
    const fromBlob = await readBlob();
    if (fromBlob) return fromBlob;
  }
  return readLocal();
}

export async function writeMembers(members: Member[]) {
  if (useBlob()) {
    await writeBlob(members);
    return;
  }
  await writeLocal(members);
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function upsertMember(input: {
  email: string;
  name?: string;
}): Promise<Member> {
  const email = normalizeEmail(input.email);
  const name = input.name?.trim() || undefined;
  const members = await readMembers();
  const existing = members.find((m) => m.email === email);

  if (existing) {
    if (name && name !== existing.name) {
      existing.name = name;
      await writeMembers(members);
    }
    return existing;
  }

  const member: Member = {
    email,
    name,
    createdAt: new Date().toISOString(),
    firstDiscountUsed: false,
  };
  members.unshift(member);
  await writeMembers(members);
  return member;
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
): Promise<Member | null> {
  const normalized = normalizeEmail(email);
  const members = await readMembers();
  const member = members.find((m) => m.email === normalized);
  if (!member) return null;
  if (!member.firstDiscountUsed) {
    member.firstDiscountUsed = true;
    await writeMembers(members);
  }
  return member;
}
