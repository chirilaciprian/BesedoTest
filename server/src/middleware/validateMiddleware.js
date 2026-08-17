import { AppError } from "../utils/AppError.js";
export function validate(schema, source = "body") {
  return function (req, res, next) {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);
      throw new AppError(`Validation error: ${errors.join(", ")}`, 400);
    }
    req[source] = result.data;
    next();
  };
}
