import Image from "next/image";
import { getApprovedReviews } from "@/lib/reviews-store";
import { StarRating } from "@/components/reviews/StarRating";
import { Button } from "@/components/ui/Button";
import { GOOGLE_REVIEW_URL } from "@/types/review";

export async function HomeReviews() {
  const reviews = await getApprovedReviews(6);
  if (reviews.length === 0) return null;

  return (
    <section className="texture-concrete border-y-2 border-navy/15">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
              Voces
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
              Quienes ya tienen
            </h2>
            <p className="mt-3 text-base text-navy/65">
              Palabras de quienes viven con una pieza Prieta.
            </p>
          </div>
          <Button href={GOOGLE_REVIEW_URL} variant="outline" className="self-start">
            Google
          </Button>
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <li key={r.id} className="texture-panel flex flex-col p-5">
              <StarRating value={r.rating} size="sm" />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-navy/75">
                “{r.text}”
              </p>
              {r.photoUrl ? (
                <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden bg-concrete-light">
                  <Image
                    src={r.photoUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
              ) : null}
              <p className="mt-4 text-sm font-semibold text-navy">{r.author}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
