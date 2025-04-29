import { body } from "express-validator";

const memberValidate = (isOptional: boolean) => {
  const Field = (field: string) => {
    const validator = body(field)
      .trim()
      .isString()
      .withMessage(`${field} must be string`);

    return !isOptional
      ? validator.notEmpty().withMessage(`${field} is required`)
      : validator.optional({ checkFalsy: true });
  };

  return [
    Field("name"),
    Field("role")
      .isIn(["owner", "admin", "member", "founder"])
      .withMessage(
        "Role must be one of the following: owner, admin, member, founder"
      ),
    Field("status")
      .isIn(["active", "inactive", "pending", "rejected", "banned"])
      .withMessage(
        "Status must be one of the following: active, inactive, pending, rejected, banned"
      ),
    Field("position"),
    Field("email").isEmail().withMessage("Invalid email format"),
  ];
};

export const validateMemberAdd = memberValidate(false);
export const validateMemberUpdate = memberValidate(true);
