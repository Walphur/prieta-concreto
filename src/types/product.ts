export type ProductCategory = "bachas" | "celosias" | "mesadas";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  currency: "ARS";
  category: ProductCategory;
  stock: number;
  featured?: boolean;
  images: string[];
  specs: {
    dimensions: string;
    weight: string;
    material: string;
    finish?: string;
  };
  comingSoon?: boolean;
};

export type CartItem = {
  productId: string;
  quantity: number;
};
