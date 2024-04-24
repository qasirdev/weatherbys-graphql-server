import {PrismaClient} from "@prisma/client";
import {extractSelection} from "../utils/extractSelections";
import {GraphQLResolveInfo} from "graphql";
import * as bcrypt from "bcryptjs";

const SALT = 12;

export interface GetUsersArgs {
  info: GraphQLResolveInfo;
}

export interface GetUserArgs extends GetUsersArgs {
  id: string;
}

interface UserInput {
  email: string;
  fullName?: string;
  password: string;
}

const prisma = new PrismaClient();

export const getUsers = async ({info}: GetUsersArgs) => {
  const extractedSelections = extractSelection(info);
  const postsIncluded = extractedSelections.includes("todos");

  if (postsIncluded) {
    return await prisma.user.findMany({include: {todos: true}});
  }

  return await prisma.user.findMany();
};

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

export const getUser = async ({id, info}: GetUserArgs) => {
  const extractedSelections = extractSelection(info);
  const todosIncluded = extractedSelections?.includes("todos");

  if (todosIncluded) {
    return await prisma.user.findUnique({where: {id}, include: {todos: true}});
  }

  return await prisma.user.findUnique({where: {id}});
};
export const getUserById = async (id:string) => {
  return await prisma.user.findUnique({where: {id}});
};

export const createUser = async ({email, fullName, password}: UserInput) => {
  console.log({email, fullName, password});

  const hashedPassword = await bcrypt.hash(password, SALT);
  console.log('hashedPassword:', hashedPassword);
  const createdUser = await prisma.user.create({
    data: {
      email,
      fullName,
      hashedPassword,
    },
  });

  return createdUser;
};
