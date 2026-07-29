export type ReviewStatus = "pending" | "approved" | "rejected";

export type Review = {
  id: string;
  author: string;
  text: string;
  rating: 1 | 2 | 3 | 4 | 5;
  photoUrl?: string;
  productSlug?: string;
  productName?: string;
  status: ReviewStatus;
  source: "site" | "google";
  createdAt: string;
};

/** Ficha de Prieta Hogar en Google Maps (San Luis). */
export const GOOGLE_MAPS_URL =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL ||
  "https://www.google.com/maps/place/Prieta+Hogar/@-33.2966711,-66.3409423,17z/data=!3m1!4b1!4m6!3m5!1s0x95d43936c0146993:0xb967809d212202de!8m2!3d-33.2966711!4d-66.3409423!16s%2Fg%2F11ydk8nz0d";

/**
 * Abre la ficha en el panel de reseñas (!9m1!1b1).
 * Feature id: 0x95d43936c0146993:0xb967809d212202de · CID 13359788231971963614.
 * Si configurás NEXT_PUBLIC_GOOGLE_REVIEW_URL con un placeid ChIJ… writereview, se usa ese.
 */
export const GOOGLE_REVIEW_URL =
  process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ||
  "https://www.google.com/maps/place/Prieta+Hogar/@-33.2966711,-66.3409423,17z/data=!4m8!3m7!1s0x95d43936c0146993:0xb967809d212202de!8m2!3d-33.2966711!4d-66.3409423!9m1!1b1!16s%2Fg%2F11ydk8nz0d";
