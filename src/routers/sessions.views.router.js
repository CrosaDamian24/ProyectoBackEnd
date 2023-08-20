import { Router } from "express";

const router = Router()

import { getRegister,
    getLogin} from "../controllers/sessions.views.controller.js";

    //Vista para registrar usuarios
router.get('/register',getRegister )

// Vista de Login
router.get('/login', getLogin)

export default router 