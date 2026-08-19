export type Member = {
  email: string;
  name?: string;
  createdAt: string;
  firstDiscountUsed: boolean;
  /** ISO date when first-purchase 15% was consumed (orders / checkout). */
  firstDiscountUsedAt?: string;
};

export const FIRST_PURCHASE_DISCOUNT = 0.15;
