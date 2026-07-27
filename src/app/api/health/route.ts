import { NextResponse } from "next/server";
import { ensureCatalogSeeded } from "@/lib/catalog";

/** Diagnóstico + seed único del catálogo en Blob */
export async function GET() {
  try {
    const seed = await ensureCatalogSeeded();
    return NextResponse.json({
      blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      nodeEnv: process.env.NODE_ENV,
      catalog: seed,
    });
  } catch (error) {
    return NextResponse.json(
      {
        blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
        error: error instanceof Error ? error.message : "unknown",
      },
      { status: 500 },
    );
  }
}
