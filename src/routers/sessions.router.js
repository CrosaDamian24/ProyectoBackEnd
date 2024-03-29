import { Router } from "express";
import passport from "passport";
import { register,
        getFailRegister,
        login,
        getFailLogin,
        getLogout,
        getGithubcallback ,
        getGithub,
        getCurrent,
        forgetPassword,
        verifyToken,
        restablecerContra} from "../controllers/sessions.controller.js";
// 
import { passportCall  } from "../middleware/middleware.js";

const router = Router()



// API para crear usuarios en la DB
router.post('/register',passport.authenticate('register', {
    failureRedirect: '/session/failRegister'}), register)

router.get('/failRegister', getFailRegister)



//API para login
router.post('/login', passport.authenticate('login', { failureRedirect: '/session/failLogin'}), login)

router.get('/failLogin',getFailLogin)

// Cerrar Session
router.get('/logout', passportCall("jwt"),getLogout)


router.get('/github',
    passport.authenticate('github', { scope: ['user:email']}),getGithub)

router.get('/githubcallback', 
    passport.authenticate('github', {failureRedirect: '/login'}),getGithubcallback
)

// datos cliente
router.get("/current",passportCall("jwt"), getCurrent) 

//Restablecer contraseña
router.post('/forget-password',forgetPassword)

//verificar token
router.get('/verify-token/:token',verifyToken)

//restablecer contraseña
router.post("/restablecer-contra/:user", restablecerContra )

export default router 