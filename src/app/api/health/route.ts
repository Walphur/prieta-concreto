import { NextResponse } from "next/server";

/** Diagnóstico no sensible: confirma si Blob está activo en runtime */
export async function GET() {
  return NextResponse.json({
    blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    nodeEnv: process.env.NODE_ENV,
  });
}
