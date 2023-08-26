import { Router } from "express";
// con FileSystem
// import { ProductManager } from "../dao/fsManagers/ProductManager.js";
import productModel from "../models/product.model.js";
import cartModel from "../models/cart.model.js";
import {  getCartByIdController } from '../controllers/carts.views.controller.js'
import passport from "passport";
// import session from "express-session";

// con FileSystem
// const manager = new ProductManager("../products.json");

const router = Router();

// router.get("/", async (req, res) => {
//   const products = await productModel.find().lean().exec()
//    // con FileSystem
//   // const products = await manager.getProducts();
//   res.render("home", { products });
// });




router.get("/carts/:cid", getCartByIdController);

// router.get("/", (req, res) => {
//   // res.render("index", {});
//   // res.render("/session/login", {});
// });

export default router;
