import { User } from "@prisma/client";
import { Session, SessionData } from "express-session";

export interface GraphQLContext { 
  req: Request & { session?: Session & Partial<SessionData> };
  user?: User;
  logout: () => void;
}
