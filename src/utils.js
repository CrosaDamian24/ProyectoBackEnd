import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import jwt from "jsonwebtoken";
import { fakerES_MX as faker } from "@faker-js/faker";

export default __dirname;

export const JWT_PRIVATE_KEY = "secret"; //clave y nombres en constantes, para no harcodearlas repetidamente
export const JWT_COOKIE_NAME = "CookieToken";

// ENCRIPTA LA CONTRASEÑA
export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// DETERMINA SI ES VALIDA LA CONTRASEÑA
export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

// generar un token con los datos del user
export const generateToken = (user) => {
  const token = jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: "24h" }); //mete al user dentro de user
  return token;
};

// extraer token de cookie
export const extractCookie = (req) => {
  return req && req.cookies ? req.cookies[JWT_COOKIE_NAME] : null;
};

export const generateProducts = () => {
  return {
    title: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price({ min: 100 , max: 7000, dec: 2}) ,// 904.00,
    code: faker.string.numeric(5),
    status: faker.datatype.boolean(),
    stock: faker.number.int({
      max: 100,
      min: 0,
    }),
    category : faker.word.adverb(5) ,
    thummbnails: faker.image.url()  ,
  };
};
