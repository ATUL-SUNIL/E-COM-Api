import { z } from "zod";
import { objectId } from "../../middlewares/validate.middleware.js";

export const addToCartSchema = {
  body: z.object({
    productId: objectId,
    quantity: z.coerce.number().int().min(1, "quantity must be at least 1").max(99),
  }),
};

// cart item _id is a numeric counter value, not an ObjectId
export const cartItemIdSchema = {
  params: z.object({ id: z.coerce.number().int().positive() }),
};
