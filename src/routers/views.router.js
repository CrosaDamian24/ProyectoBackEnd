import { Router } from "express";
 // con FileSystem
// import { ProductManager } from "../dao/fsManagers/ProductManager.js";
import productModel from "../dao/models/product.model.js";

 // con FileSystem
// const manager = new ProductManager("../products.json");

const router = Router();

router.get("/", async (req, res) => {
  const products = await productModel.find().lean().exec()
   // con FileSystem
  // const products = await manager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productModel.find().lean().exec()
   // con FileSystem
  // const products = await manager.getProducts();

  res.render("realTimeProducts", { products });
});

router.get("/", (req, res) => {
  res.render("index", {});
});

export default router;
