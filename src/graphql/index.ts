import {readFileSync} from "fs";
import path from "path";
import {usersResolver} from "./resolvers/user.resolver";
import { authResolver } from "./resolvers/auth.resolver";
import { todoResolver } from "./resolvers/todo.resolver";

const userTypes = readFileSync(path.join(__dirname, "./typeDefs/user.graphql"), {
  encoding: "utf-8",
});

const todoTypes = readFileSync(path.join(__dirname, "./typeDefs/todo.graphql"), {
  encoding: "utf-8",
});

const authTypes = readFileSync(path.join(__dirname, "./typeDefs/auth.graphql"), {
  encoding: "utf-8",
});

export const typeDefs = `
    ${userTypes}
    ${todoTypes}    
    ${authTypes}    
`;

export const resolvers = {
  Query: {
    ...usersResolver.Query,
    ...todoResolver.Query,
  },
  Mutation: {
    ...usersResolver.Mutation,
    ...authResolver.Mutation,
    ...todoResolver.Mutation,
  },
};
