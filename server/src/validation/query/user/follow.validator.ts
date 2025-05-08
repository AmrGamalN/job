import { validatorPagination } from "../pagination.validator";
import { validateString } from "../../helperFunction.validator";
export const validateQueryFollowGetAll = () => {
  return [...validatorPagination(), ...validatorCustomQuery()];
};
export const validateQueryFollowCount = () => [...validatorCustomQuery()];

const validatorCustomQuery = () => [
  validateString("followingType", true, {
    isIn: ["user", "company", "school"],
    location: "query",
  }),
  validateString("nameFollower", true, { location: "query" }),
  validateString("nameFollowing", true, { location: "query" }),
];
