import { Router } from "express";
import { ProductManager } from "../dao/fsManagers/ProductManager.js";
import { getAllProductsController,
         getProductByIdController ,
         createProductController,
         updateProductController,
         deleteProductController} from '../controllers/products.controller.js'

const manager = new ProductManager("../products.json");

const router = Router();

//TODOS LOS PRODUCTOS Y POR limit
router.get("/", getAllProductsController);

//PRODUCTOS POR ID
router.get("/:id",getProductByIdController);

//AGREGO PRODUCTOS
router.post("/", createProductController);

//ACTUALIZAR
router.put("/:id",updateProductController);

//BORRAR POR ID
router.delete("/:id",deleteProductController);

export default router;
