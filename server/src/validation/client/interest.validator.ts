import { validateArray } from "../helperFunction.validator";
const fields = ["industries", "hobbies", "influencers", "companies", "groups"];
export const InterestValidator = fields.flatMap((field) => [
  ...validateArray(field, true, { elementType: "string" }),
]);
