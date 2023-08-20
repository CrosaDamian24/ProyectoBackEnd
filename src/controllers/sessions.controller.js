import passport from "passport";
import { JWT_COOKIE_NAME } from '../utils.js'
import { signedCookie } from "cookie-parser";

export const register = async(req, res) => {
    res.redirect('/session/login')
} 

export const getFailRegister = (req, res) => {
    res.send({ error: 'Faileed!'})
}

export const login = async (req, res) => {
    // const user = await UserModel.findOne({email}).lean().exec()
    //  req.session.user = req.user

     res.cookie(JWT_COOKIE_NAME, req.user.token,signedCookie("secret")).redirect('/views/products/')
    // res.redirect('/views/products/')
}

export const getFailLogin =  (req, res) => {
    res.send({ error: 'Failed!'})
}

export const getLogout = (req, res) => {
    // req.session.destroy(err => {
    //     if(err) {
    //         console.log(err);
    //         res.status(500).render('errors/base', {error: err})
    //     } else res.redirect('/session/login')
    // })
    res.clearCookie(JWT_COOKIE_NAME).redirect("/")
    
}

export const getGithubcallback = async(req, res) => {
    // console.log('Callback: ', req.user)
    // req.session.user = req.user
 
    // res.redirect('/views/products/')
    res.cookie(JWT_COOKIE_NAME, req.user.token,signedCookie("secret")).redirect('/views/products/')
}

export const getGithub =  async(req, res) => {}

export const getCurrent = (req,res)=>{
    if(!req.user) return res.status(401).json({status: "error", error: "Sesión no detectada, inicia sesión"})
    res.status(200).json({status: "success", payload: req.user})
}