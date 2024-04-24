import * as express from "express-serve-static-core";
declare global {
	namespace Express {
    interface User {
      id: number
    }
		interface Request {
			userIndex?: number;
      session: session.Session & Partial<session.SessionData> & {
        visited?: string;
        cart?: []
      }
      // session?: Session & Partial<SessionData>;
    }

	}
}
