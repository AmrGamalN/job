export const securityTypeDefs = `
type Security {
  _id:ID
  userId: String!
  email: String
  mobile: String
  role: String
  status: String
  isEmailVerified: Boolean
  isPasswordReset: Boolean
  isAccountLocked: Boolean
  isAccountDeleted: Boolean
  isAccountClosed: Boolean
  isTwoFactorAuth: Boolean
  twoFactorSecret: String
  numberLogin: Int
  lastFailedLoginTime: String
  createdAt: String
  updatedAt: String
}

type SecurityResponse {
  success: Boolean!
  message: String
  status: Int!
  data: Security
}

type SecuritiesResponse {
  success: Boolean!
  message: String
  status: Int!
  count:Int!
  data:  [Security]
}

type Query {
  getSecurity(userId: String!): SecurityResponse!
  getAllSecurities(page:Int!=1 ,limit:Int!=10): SecuritiesResponse!
}
`;
