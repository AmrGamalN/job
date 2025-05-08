import { validatorPagination } from "../pagination.validator";
import { validateString } from "../../helperFunction.validator";
export const validateQueryConnectionGetAll = () => {
  return [...validatorPagination(), ...validatorCustomQuery()];
};
export const validateQueryConnectionCount = () => [...validatorCustomQuery()];

const validatorCustomQuery = () => [
  validateString("status", true, {
    isIn: ["accepted", "pending"],
    location: "query",
  }),
  validateString("blockStatus", true, {
    isIn: ["blocked", "unBlocked"],
    location: "query",
  }),
  validateString("recipientName", true, { location: "query" }),
];
