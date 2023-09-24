import { Router } from "express";

const router = Router()

import { getRegister,
    getLogin,getCurrent, getRestablecer
    } from "../controllers/sessions.views.controller.js";
// 
    //Vista para registrar usuarios
router.get('/register',getRegister )

// Vista de Login
router.get('/login', getLogin)

// Vista de Restablecer contraseña
router.get('/restablecer', getRestablecer)

//Vista de current
router.get('/views/current', getCurrent)

export default router 