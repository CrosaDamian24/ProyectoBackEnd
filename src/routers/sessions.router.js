import { Router } from "express";
import passport from "passport";
import { register,
        getFailRegister,
        login,
        getFailLogin,
        getLogout,
        getGithubcallback ,
        getGithub,
        getCurrent} from "../controllers/sessions.controller.js";
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
router.get('/logout', getLogout)


router.get('/github',
    passport.authenticate('github', { scope: ['user:email']}),getGithub)

router.get('/githubcallback', 
    passport.authenticate('github', {failureRedirect: '/login'}),getGithubcallback
)

// datos cliente
router.get("/current", getCurrent) 

export default router 