import { Router } from "express";
import { ProductManager } from "../dao/fsManagers/ProductManager.js";
import { getAllProductsController,
         getProductByIdController ,
         createProductController,
         updateProductController,
         deleteProductController} from '../controllers/products.controller.js'
import { handlePolicies } from "../middleware/middleware.js";

const manager = new ProductManager("../products.json");

const router = Router();

//TODOS LOS PRODUCTOS Y POR limit
router.get("/", getAllProductsController);

//PRODUCTOS POR ID
router.get("/:id",getProductByIdController);

//AGREGO PRODUCTOS
router.post("/",handlePolicies(['ADMIN'||'PREMIUM']),  createProductController);

//ACTUALIZAR
router.put("/:id",handlePolicies(['ADMIN']),updateProductController);

//BORRAR POR ID
router.delete("/:id",handlePolicies(['ADMIN'||'PREMIUM']),deleteProductController);

export default router;
