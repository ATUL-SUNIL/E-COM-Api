import { z } from "zod";
import { objectId } from "../../middlewares/validate.middleware.js";

export const likeSchema = {
  body: z.object({
    id: objectId,
    type: z.enum(["product", "category"]),
  }),
};

export const getLikesSchema = {
  query: z.object({
    id: objectId,
    type: z.enum(["product", "category"]),
  }),
};
