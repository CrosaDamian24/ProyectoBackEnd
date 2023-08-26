import express from "express";
import { Router } from "express";
import { Cart } from "../dao/fsManagers/Cart.js";
import { getCartByIdController,
        createCartController,
         addProductInCart ,
         deleteProductInCartController,
         clearCartController,
         updateProductInCart,
         createTicketController} from '../controllers/carts.controller.js'
// con FileSystem
// import { ProductManager } from '../dao/fsManagers/ProductManager.js'

const cart = new Cart("../carts.json");
// const manager = new ProductManager('../products.json');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = Router();

//PRODUCTOS POR ID
router.get("/:id", getCartByIdController);

//AGREGO carrito
router.post("/", createCartController);

//AGREGO productos a carrito existente
router.post("/:cid/product/:pid", addProductInCart);

// BORRO PRODUCTO DEL CARRITO
router.delete("/:cid/product/:pid", deleteProductInCartController)

// BORRO TODOS LOS PRODUCTOS DEL CARRITO
router.delete("/:cid",clearCartController)

//Actualizo cantidad de productos
router.put("/:cid/product/:pid", updateProductInCart)

//COMPRA
router.post("/:cid/purchase", createTicketController);

export default router;
