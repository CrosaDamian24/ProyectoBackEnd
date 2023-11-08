import { Router } from "express";
import { passportCall  } from "../middleware/middleware.js";

const router = Router()

import { getRegister,
    getLogin,getCurrent, getRestablecer, getVerificarToken
    } from "../controllers/sessions.views.controller.js";
// 
    //Vista para registrar usuarios
router.get('/register',getRegister )

// Vista de Login
router.get('/login', getLogin)

// Vista de Restablecer contraseña
router.get('/restablecer', getRestablecer)

// Vista de Restablecer contraseña
router.get('/restablecer', getRestablecer)
router.get('/verify-token', getVerificarToken)

//Vista de current
router.get('/views/current', passportCall("jwt"),getCurrent)

export default router 