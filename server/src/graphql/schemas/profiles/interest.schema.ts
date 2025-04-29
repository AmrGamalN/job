export const interestTypDefs = `
type Interest {
    _id: ID!
    userId: String!
    industries: [String]
    hobbies: [String]
    influencers: [String]
    companies: [String]
    groups: [String]
    createdAt: String!
    updatedAt: String!
}

type InterestResponse {
    success: Boolean!
    status: Int!
    message: String!
    interest: Interest
}

type Query {
    getInterest(id: String, typeOwner: String): InterestResponse!
}
`;
