import { Router } from "express";
import { ProductManager } from "../ProductManager.js";

const manager = new ProductManager("../products.json");

const router = Router();

router.get("/", async (req, res) => {
  const products = await manager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await manager.getProducts();

  res.render("realTimeProducts", { products });
});

router.get("/", (req, res) => {
  res.render("index", {});
});

export default router;
