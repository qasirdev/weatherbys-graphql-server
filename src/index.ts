import { Request, Response, NextFunction } from "express-serve-static-core";
import express, { json } from "express";

import cookieParser from "cookie-parser";
import session from "express-session";
import { v4 as uuidv4 } from 'uuid';
import passport from "passport";
import pg from 'pg';
import pgSession from 'connect-pg-simple';
import { buildContext, GraphQLLocalStrategy } from 'graphql-passport';
import * as userService from "../src/graphql/services/user.service";

import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from 'apollo-server-express';
import {typeDefs, resolvers} from "./graphql";
import { getAllUsers } from "./graphql/services/user.service";
import { GraphQLError } from "graphql";
import { ErrorWithExtensions } from "./graphql/resolvers/todo.resolver";

dotenv.config();
const pgSessionStore = pgSession(session);
const { DATABASE_URL } = process.env;

// Create a PostgreSQL pool using the DATABASE_URL
const pool = new pg.Pool({
  connectionString: DATABASE_URL
});

passport.use(
  new GraphQLLocalStrategy(async (email, password, done) => {
    const users = await getAllUsers();
    const findUser = users.find(user => email === user.email);
    const error = findUser ? null : new Error('no matching user');
    done(error, findUser);
  }),
);

  passport.serializeUser((user:any, done) => {
    console.log('user in serializeUser', user)
    done(null, user?.id);
  });
  
  passport.deserializeUser(async (id:any, done) => {
    try {
      console.log('id in deserialize:', id)
      const users = await getAllUsers();
      const findUser = users.find(user => user.id === id);
      if (!findUser) throw new Error("User Not Found");
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  });


const app = express();
const port = process.env.PORT || 4000;

const bootstrapServer = async () => {
  app.use(cors());
  app.use(express.json());

  const loggingMiddleware = (req:Request,res:Response, next:NextFunction) => {
    console.log(`${req.method} - ${req.url}`);
    next();
  }
  app.use(cookieParser("helloworld"));
  app.use(session({
    genid: (req) => uuidv4(),
    secret:process.env.SECRET as string,
    resave:false,
    saveUninitialized:false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    },
    store: new pgSessionStore({
      pool, // Pass the PostgreSQL pool to the session store
      tableName: 'Session', // Name of the table to store sessions (optional)
    }),
  }))

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(loggingMiddleware);

  app.use(express.urlencoded({extended: true}));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => buildContext({ req, res, userService }),
    formatError: (error: GraphQLError): ErrorWithExtensions => {
      // Customize error formatting (logging, additional metadata)
      return {
        message: error.message,
        extensions: error.extensions 
      };
    },
  
  });
  await server.start();
  server.applyMiddleware({ app });

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(port, () => {
    console.log(`Express ready at http://localhost:${port}`);
    console.log(`Graphql ready at http://localhost:${port}/graphql`);
  });
};

bootstrapServer();
