import { z } from "zod";

// A valid Mongo ObjectId is 24 hex characters — reused across features.
export const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "must be a valid id");

/**
 * Validate a request against Zod schemas for { body, params, query } before the
 * handler runs. On success, coerced body/params are written back so controllers
 * receive clean, typed values (e.g. quantity as a number, not "5"). On failure,
 * respond 400 with the specific fields that were wrong — no controller or DB
 * code ever sees invalid input.
 */
export const validate = (schemas) => (req, res, next) => {
  try {
    if (schemas.body) req.body = schemas.body.parse(req.body);
    if (schemas.params) req.params = schemas.params.parse(req.params);
    // req.query is a getter in Express 4 — validate it (reject bad shapes) but don't reassign it.
    if (schemas.query) schemas.query.parse(req.query);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid request",
        details: err.issues.map((i) => ({ field: i.path.join(".") || "(body)", message: i.message })),
      });
    }
    next(err);
  }
};
