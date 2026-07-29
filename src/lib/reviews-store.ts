import { promises as fs } from "fs";
import path from "path";
import { del, list, put } from "@vercel/blob";
import type { Review } from "@/types/review";

const DATA_PATH = path.join(process.cwd(), "data", "reviews.json");
const BLOB_VERSION_PREFIX = "reviews/v/";
const BLOB_HEAD_PATH = "reviews/head.json";
const MAX_VERSIONS = 15;

function useBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

type HeadPointer = { url: string; pathname: string; updatedAt: string };

async function readLocal(): Promise<Review[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    return JSON.parse(raw) as Review[];
  } catch {
    return [];
  }
}

async function writeLocal(reviews: Review[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(reviews, null, 2), "utf8");
}

async function fetchJson(url: string): Promise<Review[] | null> {
  const res = await fetch(
    `${url}${url.includes("?") ? "&" : "?"}_=${Date.now()}`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  return (await res.json()) as Review[];
}

async function readBlob(): Promise<Review[] | null> {
  const { blobs: heads } = await list({ prefix: BLOB_HEAD_PATH, limit: 5 });
  const headBlob = heads.find((b) => b.pathname === BLOB_HEAD_PATH);
  if (headBlob) {
    const head = (await fetch(
      `${headBlob.url}?_=${Date.now()}`,
      { cache: "no-store" },
    ).then((r) => (r.ok ? r.json() : null))) as HeadPointer | null;
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

async function writeBlob(reviews: Review[]) {
  const pathname = `${BLOB_VERSION_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 7)}.json`;
  const blob = await put(pathname, JSON.stringify(reviews, null, 2), {
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

export async function readReviews(): Promise<Review[]> {
  if (useBlob()) {
    const fromBlob = await readBlob();
    if (fromBlob) return fromBlob;
  }
  return readLocal();
}

export async function writeReviews(reviews: Review[]) {
  if (useBlob()) {
    await writeBlob(reviews);
    return;
  }
  await writeLocal(reviews);
}

export async function getApprovedReviews(limit?: number) {
  const all = await readReviews();
  const approved = all
    .filter((r) => r.status === "approved")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  return typeof limit === "number" ? approved.slice(0, limit) : approved;
}
