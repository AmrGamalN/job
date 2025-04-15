export const registerTypeDefs = `
scalar Upload

type RegisterResponse {
  success: Boolean!
  message: String
  status: Int!
  error: String
}

input RegisterData {
    email: String!
    phoneNumber: String!
    password: String!
    confirmPassword: String!
    firstName: String!
    lastName: String!
    visibility: String
    gender: String!
    terms: Boolean!
}

type Query {
  _empty: String
}

type Mutation {
  register(input: RegisterData!): RegisterResponse!
}
`;
