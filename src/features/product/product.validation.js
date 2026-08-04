import { z } from "zod";
import { objectId } from "../../middlewares/validate.middleware.js";

export const filterSchema = {
  query: z.object({
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    category: z.string().optional(), // must be a plain string — never an operator object
  }),
};

export const rateSchema = {
  body: z.object({
    productId: objectId,
    rating: z.coerce.number().int().min(1).max(5),
  }),
};

export const addProductSchema = {
  // multipart text fields arrive as strings — coerce price to a number
  body: z.object({
    name: z.string().trim().min(1, "name is required"),
    price: z.coerce.number().positive("price must be greater than 0"),
    description: z.string().optional(),
    // required: the repository splits this unconditionally, so absence would crash
    categories: z.string().trim().min(1, "at least one category is required"),
    sizes: z.string().optional(), // controller uses sizes?.split(), so absence is safe
  }),
};

export const productIdSchema = {
  params: z.object({ id: objectId }),
};
