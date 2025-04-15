import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { registerResolver } from "./resolvers/auth/register.resolver";
import { registerTypeDefs } from "./schema/auth/register.schema";
import { profileTypeDefs } from "./schema/profiles/profile.schema";
import { userTypeDefs } from "./schema/profiles/user.schema";
import { securityTypeDefs } from "./schema/Security/security.schema";
import { userResolver } from "./resolvers/profiles/user.resolver";
import { profileResolver } from "./resolvers/profiles/profile.resolver";
import { SecurityResolver } from "./resolvers/security/security.resolver";

const typeDefs = mergeTypeDefs([
  registerTypeDefs,
  userTypeDefs,
  profileTypeDefs,
  securityTypeDefs,
]);

const resolvers = mergeResolvers([
  registerResolver,
  userResolver,
  profileResolver,
  SecurityResolver,
]);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
