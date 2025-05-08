import { validateString } from "../helperFunction.validator";
const stringLength = { min: 1, max: 50 };
export const validateFollowAdd = () => [
  validateString("followingId", false, { pattern: /^[a-zA-Z0-9]{28}$/ }),
  validateString("followingType", false, {
    isIn: ["user", "company", "school"],
  }),
  validateString("nameFollowing", false, stringLength),
];

export const validateFollowUpdate = () => [
  validateString("followStatus", false, { isIn: ["follow", "unfollow"] }),
];
