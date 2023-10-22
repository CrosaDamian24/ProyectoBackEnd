import express from "express";
import { Router } from "express";
import { Cart } from "../dao/fsManagers/Cart.js";
import { 
        updateRolUser
         } from '../controllers/users.controller.js'
import { uploader } from "../middleware/multer.js";
import { sendDocument } from "../controllers/users.controller.js";
// con FileSystem
// import { ProductManager } from '../dao/fsManagers/ProductManager.js'

// const cart = new Cart("../carts.json");
// const manager = new ProductManager('../products.json');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = Router();


//Actualizo cantidad de productos
router.put("/premium/:uid", updateRolUser)

//Subo documentos de usuario
router.put("/:uid/documents",uploader.fields([{name:"identificacion"},{name:"domicilio"},{name:"cuenta"}]), sendDocument)


export default router;
