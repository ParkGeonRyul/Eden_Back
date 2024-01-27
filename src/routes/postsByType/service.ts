import { ValidationError } from "../../utils/cunstomError";

export const test = () => {
  try {
    throw new ValidationError("ServiceError", 402);
  } catch (err: unknown) {
    throw err;
  }
};
