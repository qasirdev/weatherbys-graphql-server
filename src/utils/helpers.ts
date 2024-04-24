// import bcrypt from "bcrypt";
import * as bcrypt from "bcryptjs";

const saltRounds = 10;

export const hashPassword = (password:string) => {
	const salt = bcrypt.genSaltSync(saltRounds);
	return bcrypt.hashSync(password, salt);
};

export const comparePassword = (plain:string, hashed:string) =>
	bcrypt.compareSync(plain, hashed);
