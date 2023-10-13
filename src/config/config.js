import dotenv from "dotenv";
import { Command } from "commander";

dotenv.config();

const program = new Command();

program.option("-m <mode>", "Modo base datos", "MONGO");
program.parse();

const persistencia = program.opts().m;


export default {
  PORT: process.env.PORT,
  CONNECT: process.env.MONGO_CONNECT,
  PERSISTENCE: persistencia,
  NODEMAILER_USER: process.env.NODEMAILER_USER,
  NODEMAILER_PASS: process.env.NODEMAILER_PASS,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,             //EMAIL DE REGISTRO DEL ADMINISTRADOR 
  ADMIN_PASS : process.env.ADMIN_PASS,
  COOKIENAMEJWT: process.env.JWT_COOKIE_NAME,       //cookie jwt
  KEYPRIVATEJWT: process.env.JWT_PRIVATE_KEY,       //clave privada cookie
};
