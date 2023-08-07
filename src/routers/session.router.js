import { Router } from "express";
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";
import { JWT_COOKIE_NAME } from '../utils.js'
import { signedCookie } from "cookie-parser";


const router = Router()

//Vista para registrar usuarios
router.get('/register', (req, res) => {
    res.render('sessions/register')
})

// API para crear usuarios en la DB
router.post('/register',passport.authenticate('register', {
    failureRedirect: '/session/failRegister'
}), async(req, res) => {

 
    res.redirect('/session/login')
})
    //     const userNew = {
    //     first_name : req.body.first_name,
    //     last_name : req.body.last_name,
    //     age : req.body.age,
    //     email : req.body.email,
    //     password : createHash(req.body.password)

    // }

    // const user = new UserModel(userNew)
    // await user.save()

    // res.redirect('/session/login')

// })
router.get('/failRegister', (req, res) => {
    res.send({ error: 'Faileed!'})
})

// Vista de Login
router.get('/login', (req, res) => {
    res.render('sessions/login')
})

//API para login
router.post('/login', passport.authenticate('login', { failureRedirect: '/session/failLogin'}), async (req, res) => {
    // const user = await UserModel.findOne({email}).lean().exec()
    //  req.session.user = req.user

     res.cookie(JWT_COOKIE_NAME, req.user.token,signedCookie("secret")).redirect('/views/products/')
    // res.redirect('/views/products/')
})

router.get('/failLogin', (req, res) => {
    res.send({ error: 'Failed!'})
})
// router.post('/login',async(req,res) =>{
//     const {email,password} = req.body

//     const user = await UserModel.findOne({email}).lean().exec()
//     // const user = await UserModel.findOne({email,password}).lean().exec()
//     if(!user  && (email !== 'adminCoder@coder.com' || password !== 'adminCod3r123') ){
     
//         return res.status(401).render('errors/base',{
//             error:'Error en email y/o contraseña'
//         })   
   
//     }
// if (email !== 'adminCoder@coder.com' || password !== 'adminCod3r123'){
//     if (!isValidPassword(user,password) ){
//         return res.status(401).render('errors/base',{
//             error:'Error en email y/o contraseña'
//         })   
//     }
    
// }
//    if (email !== 'adminCoder@coder.com'){
//     req.session.user = user
//    }else{
//     req.session.user = {
//         first_name: 'Admin',
//          role: 'Admin'
//       }
//    }
//      res.redirect('/views/products/')

// })

// Cerrar Session
router.get('/logout', (req, res) => {
    // req.session.destroy(err => {
    //     if(err) {
    //         console.log(err);
    //         res.status(500).render('errors/base', {error: err})
    //     } else res.redirect('/session/login')
    // })
    res.clearCookie(JWT_COOKIE_NAME).redirect("/")
    
})


router.get('/github',
    passport.authenticate('github', { scope: ['user:email']}),
    async(req, res) => {}
)

router.get('/githubcallback', 
    passport.authenticate('github', {failureRedirect: '/login'}),
    async(req, res) => {
        // console.log('Callback: ', req.user)
        // req.session.user = req.user
     
        // res.redirect('/views/products/')
        res.cookie(JWT_COOKIE_NAME, req.user.token,signedCookie("secret")).redirect('/views/products/')
    }
)

//datos cliente
router.get("/current", (req,res)=>{
    if(!req.user) return res.status(401).json({status: "error", error: "Sesión no detectada, inicia sesión"})
    res.status(200).json({status: "success", payload: req.user})
}) 





export default router 