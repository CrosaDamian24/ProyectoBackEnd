import passport from "passport";
import { JWT_COOKIE_NAME, generateRandomString } from '../utils.js'
import { signedCookie } from "cookie-parser";
import UserDTO from "../dto/user.js";
import {  UserPassworService, UserService } from "../services/index.js";
import config from "../config/config.js";
import nodemailer from "nodemailer"

export const register = async(req, res) => {
    res.redirect('/session/login')
} 

export const getFailRegister = (req, res) => {
    res.send({ error: 'Faileed!'})
}

export const login = async (req, res) => {
    // const user = await UserModel.findOne({email}).lean().exec()
    //  req.session.user = req.user
   
    //  res.cookie(JWT_COOKIE_NAME, req.user.token,signedCookie("secret")).redirect('/views/products/')
    //  res.cookie(JWT_COOKIE_NAME, req.user.token,signedCookie("secret")).status(401).json({ status : 'ok', token : req.user.token})
     res.cookie(JWT_COOKIE_NAME, req.user.token,signedCookie("secret")).redirect('/views/products/')
    // res.redirect('/views/products/')
    // res.status(401).json({ status : 'ok', paso : "paso OK"})
}

export const getFailLogin =  (req, res) => {
    res.send({ error: 'Failed!'})
}

export const getLogout = (req, res) => {
    req.session.destroy(err => {
        // if(err) {
        //     console.log(err);
        //     res.status(500).render('errors/base', {error: err})
        // } else res.redirect('/session/login')
    })
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
    let results = new UserDTO(req.user)
    // res.status(200).json({status: "success", payload: results})
    res.status(200).json({status: "success", payload: results})
}

export const forgetPassword =  async (req, res) => {
  
    try {
      const email = req.body.email
    //   console.log(email)
       const user = await UserService.getOne({email})
        if(!user){
            return res.status(404).json({ status : 'error', error: 'User not found'})
        }
        const token = generateRandomString(16)

        await UserPassworService.create({email,token})
        const mailerConfig = {
            // uri:wtimeoutMS,
            service : 'gmail',
            auth : { user: config.nodemailer_user, pass: config.nodemailer_pass}
        }

        let transporter = nodemailer.createTransport(mailerConfig)
        let message = {
            from:config.nodemailer_user,
            to: email,
            subject: 'Restablezca contraseña',
            html: `<h1>Reset your password</h1>`
        }
        try{
            await transporter.sendMail(message)
            res.json({ status: 'success', message:`Email succesfully sent to ${email} in order to reset`})
        }
        catch (err){
            res.status(500).json({ status : 'error',error: err.message})
        }
    //   // const result = await productModel.findByIdAndDelete(id)
    //   const result = await ProductService.delete(id)
    //   if (result === null){
    //     return res.status(404).json({ status : 'error', error: 'Not found'})
    //   }
    //   const products = await ProductService.getAll()
    //      req.app.get('socketio').emit('updateProducts',products)
    //    res.status(200).json({ status : 'succes', payload : result})
    //    res.status(200).json({ status : 'succes'})
  }catch(err){
    res.status(500).json({ status : 'error', error : err.message})
  }
}