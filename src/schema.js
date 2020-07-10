import path from "path";
import { makeExecutableSchema } from "graphql-tools";

import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";

const allTypes = loadFilesSync(path.join(__dirname, "/api/**/*.graphql"));
const allResolvers = loadFilesSync(path.join(__dirname, "/api/**/*.js"));
//api 폴더 내에는 resolver인 js만 둘 것

const schema = makeExecutableSchema({
  typeDefs: mergeTypeDefs(allTypes),
  resolvers: mergeResolvers(allResolvers),
});

export default schema;
