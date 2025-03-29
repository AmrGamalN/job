export const userTypeDefs = `
type user {
  _id:ID
  userId: String!
  firstName: String
  lastName: String
  profileImage: String
  coverImage: String
  account: String
  linkedIn: String
  github: String
  website: String
  visibility: String
  createdAt: String
  updatedAt: String
}

type UserResponse {
  success: Boolean!
  message: String
  status: Int!
  data: user
}

type UsersResponse {
  success: Boolean!
  message: String
  status: Int!
  count:Int!
  data: [user]
}

type Query {
  getUser(userId: String): UserResponse!
  getAllUsers(page:Int!=1 ,limit:Int!=10): UsersResponse!
}
`;
