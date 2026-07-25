"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  productName: string;
};

type Review = {
  id: string;
  author: string;
  text: string;
  photoName?: string;
};

const seed: Review[] = [
  {
    id: "1",
    author: "María G.",
    text: "La textura es impecable. Quedó perfecta en nuestro baño principal.",
  },
  {
    id: "2",
    author: "Tomás R.",
    text: "Embalaje cuidado y pieza tal cual las fotos del estudio.",
  },
];

export function ReviewSection({ productName }: Props) {
  const [reviews, setReviews] = useState(seed);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [photoName, setPhotoName] = useState<string | undefined>();
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;
    setReviews((prev) => [
      {
        id: String(Date.now()),
        author: author.trim(),
        text: text.trim(),
        photoName,
      },
      ...prev,
    ]);
    setAuthor("");
    setText("");
    setPhotoName(undefined);
    setSent(true);
  }

  return (
    <section className="mt-20 border-t border-concrete pt-14">
      <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-semibold text-navy">
        Comentarios y reseñas
      </h2>
      <p className="mt-2 text-sm text-navy/60">
        Contanos tu experiencia con {productName}. Podés adjuntar una foto
        (la carga a storage se conectará con Uploadthing/Firebase).
      </p>

      <form onSubmit={onSubmit} className="mt-8 max-w-xl space-y-4">
        <div>
          <label htmlFor="author" className="text-sm font-medium text-navy">
            Nombre
          </label>
          <input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="mt-1 w-full border border-concrete bg-white px-3 py-2.5 text-sm outline-none ring-sage focus:ring-2"
            required
          />
        </div>
        <div>
          <label htmlFor="review" className="text-sm font-medium text-navy">
            Comentario
          </label>
          <textarea
            id="review"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="mt-1 w-full border border-concrete bg-white px-3 py-2.5 text-sm outline-none ring-sage focus:ring-2"
            required
          />
        </div>
        <div>
          <label htmlFor="photo" className="text-sm font-medium text-navy">
            Foto (opcional)
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setPhotoName(e.target.files?.[0]?.name ?? undefined)
            }
            className="mt-1 block w-full text-sm text-navy/70 file:mr-3 file:border-0 file:bg-concrete-light file:px-3 file:py-2 file:text-sm file:font-medium file:text-navy"
          />
          {photoName ? (
            <p className="mt-1 text-xs text-sage-dark">
              Seleccionada: {photoName}
            </p>
          ) : null}
        </div>
        <Button type="submit" variant="primary">
          Publicar reseña
        </Button>
        {sent ? (
          <p className="text-xs text-sage-dark">
            Reseña agregada localmente. En producción quedará pendiente de
            moderación.
          </p>
        ) : null}
      </form>

      <ul className="mt-12 space-y-6">
        {reviews.map((r) => (
          <li key={r.id} className="border-b border-concrete/80 pb-6">
            <p className="font-semibold text-navy">{r.author}</p>
            <p className="mt-2 text-navy/70">{r.text}</p>
            {r.photoName ? (
              <p className="mt-2 text-xs text-sage">Foto: {r.photoName}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
