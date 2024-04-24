import {GraphQLResolveInfo} from "graphql";
import {createUser, getUser, getUsers} from "../services/user.service";
import { GraphQLContext } from "../../../types/context";

export const usersResolver = {
  Query: {
    async users(_: any, args: Record<string, any>, context: any, info: GraphQLResolveInfo) {
      return await getUsers({info});
    },
    async user(_: any, args: Record<string, any>, context: any, info: GraphQLResolveInfo) {
      return await getUser({id: args.id, info});
    },
    async currentUser(_: any, args: Record<string, any>, context: any) {
      const id = context?.req?.sessionStore?.sessions?.passport?.user?.id || 'ddb867bb-8f41-4033-ae16-3924982d11b6';
      console.log('currentUser - id:  ',id);
      return context.userService.getUserById(id)
    },
  },
  Mutation: {
    async createUser(_: any, {input}: Record<string, any>, context:any) {
      const user = await createUser({email: input.email, fullName: input.fullName, password: input.password});
      if (context.req.session) {
        //@ts-ignore
        context.req.session.userId = user.id;
      }
      return user;
    },
    async updateUser() {},
    async deleteUser() {},
  },
};
