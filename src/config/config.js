import dotenv from "dotenv";
import { Command } from "commander";

dotenv.config();

const program = new Command();

program.option("-m <mode>", "Modo base datos", "MONGO");
program.parse();

const persistencia = program.opts().m;


export default {
  port: process.env.PORT,

  //  uri: process.env.MONGO_URI,
  //  dbname: process.env.MONGO_DBNAME,
  connect: process.env.MONGO_CONNECT,
  persistence: persistencia,
  nodemailer_user: process.env.NODEMAILER_USER,
  nodemailer_pass: process.env.NODEMAILER_PASS
  //  process.env.PERSISTANCE
  //
  //

};
