import express from "express";
import { Router } from "express";
import { 
        updateRolUser
         } from '../controllers/users.controller.js'
import { uploader } from "../middleware/multer.js";
import { sendDocument, getAllUsersController} from "../controllers/users.controller.js";
import { handlePolicies } from "../middleware/middleware.js";
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

//TODOS los Usuarios
router.get("/",handlePolicies(['ADMIN']), getAllUsersController);

export default router;
