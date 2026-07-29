import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { readReviews, writeReviews } from "@/lib/reviews-store";
import type { Review, ReviewStatus } from "@/types/review";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as ReviewStatus | "all" | null;
  const admin = await isAdminAuthenticated();

  let reviews = await readReviews();

  if (!admin) {
    reviews = reviews.filter((r) => r.status === "approved");
  } else if (status && status !== "all") {
    reviews = reviews.filter((r) => r.status === status);
  }

  reviews = [...reviews].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return NextResponse.json(reviews, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    author?: string;
    text?: string;
    rating?: number;
    photoUrl?: string;
    productSlug?: string;
    productName?: string;
  };

  const author = body.author?.trim() ?? "";
  const text = body.text?.trim() ?? "";
  const rating = Number(body.rating);

  if (author.length < 2 || text.length < 10) {
    return NextResponse.json(
      { error: "Nombre y comentario son obligatorios (mín. 10 caracteres)." },
      { status: 400 },
    );
  }
  if (![1, 2, 3, 4, 5].includes(rating)) {
    return NextResponse.json({ error: "Rating inválido" }, { status: 400 });
  }
  if (author.length > 80 || text.length > 1200) {
    return NextResponse.json({ error: "Texto demasiado largo" }, { status: 400 });
  }

  const review: Review = {
    id: `rev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    author,
    text,
    rating: rating as 1 | 2 | 3 | 4 | 5,
    photoUrl: body.photoUrl?.trim() || undefined,
    productSlug: body.productSlug?.trim() || undefined,
    productName: body.productName?.trim() || undefined,
    status: "pending",
    source: "site",
    createdAt: new Date().toISOString(),
  };

  try {
    const reviews = await readReviews();
    reviews.unshift(review);
    await writeReviews(reviews);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "No se pudo guardar la reseña",
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      message:
        "Gracias. Quedó pendiente de aprobación.",
    },
    { status: 201 },
  );
}
