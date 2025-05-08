export const profileTypeDefs = `

type Language {
  language: String
  level: String
}

type Profile {
  _id:ID
  userId: String!
  about: String
  jobTitle: String
  jobDescription: String
  jobLocation: String
  jobCompany: String
  jobType: String
  projectPreference: String
  experienceLevel: String
  categories: [String]
  skills: [String]
  languages: [Language]
  profileLink: String
  followers: Int
  following: Int
  createdAt: String
  updatedAt: String
}

type ProfileResponse {
  success: Boolean!
  message: String
  status: Int!
  data: Profile
}

type ProfilesResponse {
  success: Boolean!
  message: String
  status: Int!
  count:Int!
  data:  [Profile]
}

type Query {
  getProfile(userId: String): ProfileResponse!
  getAllProfiles(page:Int!=1 ,limit:Int!=10): ProfilesResponse!
}
`;
