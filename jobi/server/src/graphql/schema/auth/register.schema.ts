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
    mobile: String!
    password: String!
    confirmPassword: String!
    firstName: String!
    lastName: String!
    profileImage: String
    coverImage: String
    visibility: String
}

type Query {
  _empty: String
}

type Mutation {
  register(input: RegisterData!): RegisterResponse!
}
`;
