import { Router } from "express";
// con FileSystem
// import { ProductManager } from "../dao/fsManagers/ProductManager.js";
import { getAllProductsViewsController,
         realTimeProducts } from '../controllers/products.views.controller.js'
import passport from "passport";
// import session from "express-session";
import { passportCall ,handlePolicies } from "../middleware/middleware.js";

// con FileSystem
// const manager = new ProductManager("../products.json");

const router = Router();

// router.get("/", async (req, res) => {
//   const products = await productModel.find().lean().exec()
//    // con FileSystem
//   // const products = await manager.getProducts();
//   res.render("home", { products });
// });



router.get("/products",getAllProductsViewsController);

router.get("/realtimeproducts",passportCall("jwt"), realTimeProducts);


// router.get("/", (req, res) => {
//   // res.render("index", {});
//   // res.render("/session/login", {});
// });

export default router;
