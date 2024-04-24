import {PrismaClient, Todo} from "@prisma/client";
import {extractSelection} from "../utils/extractSelections";
import {GraphQLResolveInfo} from "graphql";

export interface GetTodosArgs {
  info: GraphQLResolveInfo;
}

export interface GetTodoArgs extends GetTodosArgs {
  id: string;
}

interface TodoInput {
  userId: string;
  title: string;
  completed: boolean;
}
interface TodoUpdate {
  id: string;
  title: string;
  completed: boolean;
}
interface TodoDelete {
  id: string;
}

const prisma = new PrismaClient();

export const getTodos = async ({info}: GetTodosArgs) => {
  const extractedSelections = extractSelection(info);
  const userIncluded = extractedSelections.includes("user");

  if (userIncluded) {
    return await prisma.todo.findMany({include: {user: true}});
  }

  return await prisma.todo.findMany();
};

export const getAllTodos = async () => {
  return await prisma.todo.findMany();
};

export const getTodo = async ({id, info}: GetTodoArgs) => {
  const extractedSelections = extractSelection(info);
  const userIncluded = extractedSelections?.includes("user");

  if (userIncluded) {
    return await prisma.todo.findUnique({where: {id}, include: {user: true}});
  }

  return await prisma.todo.findUnique({where: {id}});
};
export const getTodosByUserId = async ({id, info}: GetTodoArgs) => {
    return await prisma.todo.findMany(
      {
        where: {
          userId: id
        }
      }
    );

};
export const getTodoById = async (id:string) => {
  return await prisma.todo.findUnique({where: {id}});
};

export const createTodo = async ({userId, title, completed}: TodoInput) => {

  const createdTodo = await prisma.todo.create({
    data: {
      userId, 
      title,
      completed
    },
  });

  return createdTodo;
};
export const updateTodo = async ({id, title, completed}: TodoUpdate) => {

  return await prisma.todo.update({
    where: {
      id
    },
    data: {
      title,
      completed
    }
  });
}
export const deleteTodo = async ({id}: TodoDelete) => {

  return await prisma.todo.delete({
    where: {
      id
    }
  })
};

