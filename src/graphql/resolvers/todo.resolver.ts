import {GraphQLResolveInfo} from "graphql";
import { createTodo, deleteTodo, getTodo, getTodos, getTodosByUserId, updateTodo } from "../services/todo.service";
import { ApolloError } from 'apollo-server-express';

export interface ErrorWithExtensions {
  message: string;
  extensions?: Record<string, any>; // Additional error info
}

export const todoResolver = {
  Query: {
    async todos(_: any, args: Record<string, any>, context: any, info: GraphQLResolveInfo) {
      return await getTodos({info});
    },
    async todo(_: any, args: Record<string, any>, context: any, info: GraphQLResolveInfo) {
      return await getTodo({id: args.id, info});
    },
    async todosByUserId(_: any, args: Record<string, any>, context: any, info: GraphQLResolveInfo) {
      console.log('todos - context?.req?.user:',context?.req?.user);
      if(!context?.req?.user){
        throw new ApolloError('User not found', 'USER_NOT_FOUND', { userId: context?.req?.user });   
      }
      return await getTodosByUserId({id: args.id, info});
    },
  },
  Mutation: {
    async createTodo(_: any, {input}: Record<string, any>, context:any) {
      console.log(`createTodo - context.req.user:${context.req.user}`);
      const newTodo = createTodo({title: input.title, completed: input.completed, userId: input.userId})
      return newTodo;
    },
    async updateTodo(_: any, {input}: Record<string, any>, context:any) {
      const updatedTodo = updateTodo({id: input.id, title: input.title, completed: input.completed});
      return updatedTodo;
    },
    async deleteTodo(_: any, {input}: Record<string, any>, context:any) {
      const deletedTodo = deleteTodo({id: input?.id});
      return deletedTodo;
    },
  },
};
