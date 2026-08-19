import { NextResponse } from "next/server";
import { ensureCatalogSeeded } from "@/lib/catalog";

/** Diagnóstico + seed único del catálogo en Blob */
export async function GET() {
  const blobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  const onVercel = Boolean(process.env.VERCEL);
  try {
    const seed = await ensureCatalogSeeded();
    return NextResponse.json({
      blobConfigured,
      nodeEnv: process.env.NODE_ENV,
      catalog: seed,
      membersStorage: blobConfigured
        ? "blob"
        : onVercel || process.env.NODE_ENV === "production"
          ? "signed-cookie"
          : "local-file",
    });
  } catch (error) {
    return NextResponse.json(
      {
        blobConfigured,
        error: error instanceof Error ? error.message : "unknown",
      },
      { status: 500 },
    );
  }
}
