import passport from "passport";
import {  generateRandomString, createHash, isValidPassword} from '../utils.js'
import { signedCookie } from "cookie-parser";
import UserDTO from "../dto/user.js";
import {  UserPassworService, UserService } from "../services/index.js";
import config from "../config/config.js";
import nodemailer from "nodemailer"
import moment               from "moment/moment.js";

const JWT_COOKIE_NAME = config.COOKIENAMEJWT
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

export const getLogout = async (req, res) => {
    console.log(req.user.user._id)
    const user = await UserService.getOne({ _id: req.user.user._id })
    await UserService.updateUser(req.user.user._id,{last_connection:moment().format("DD/MM/YYYY HH:mm:ss")})
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
            auth : { user: config.NODEMAILER_USER, pass: config.NODEMAILER_PASS}
        }

        let transporter = nodemailer.createTransport(mailerConfig)
        let message = {
            from:config.nodemailer_user,
            to: email,
            subject: 'Restablezca contraseña',
            html: `<h1>Restablece tu contraseña</h1><hr /> Haz click en el siguiente enlace:
            <a href="http://localhost:8080/session/verify-token/${token}">Click Aquí</a>`
        }
        try{
            await transporter.sendMail(message)
            res.json({ status: 'success', message:`Email succesfully sent to ${email} in order to reset`})
        }
        catch (err){
            res.status(500).json({ status : 'error',error: err.message})
        }
  }catch(err){
    res.status(500).json({ status : 'error', error : err.message})
  }
}

export const verifyToken= async(req,res) =>{
    try{
        const userPassword= await UserPassworService.getUserPassword({token: req.params.token})
      
        if(!userPassword){
            //si no pongo return, y hago varios clicks en el link del email, revienta y dice 'ERR_HTTP_HEADERS_SENT', ya que envia multiples encabezados
           return res.status(400).json({status: "error", error: "Token no válido // Token expiró"}) 
        }
        const user=  userPassword.email
       
        res.render("sessions/verify-token", {user})
    }catch(err){
        res.status(400).json({status:"error", error:err.message})
    }
}

export const restablecerContra= async(req,res)=>{
    try{
        const user = await UserService.getOne({email: req.params.user}) 
    //    console.log(user)
        const nueva = createHash(req.body.newPassword)
      
        if (isValidPassword(user, req.body.newPassword)) {
            //  console.log("igules")
             return  res.status(400).json({status:"error", message: "La contraseña no puede ser igual a la anterior"})   
            // return done(null, false)
    }
            //busco un usuario por su email
        await UserService.updateUser(user._id, {password: nueva} ) //luego modifico su contraseña
     
        await UserPassworService.deleteOne({email: req.params.user})    
        return  res.status(200).json({status:"success", message: "Contraseña creada con éxito"})                        //elimino el token de cambio de contraseña
    }catch(err){
        res.status(400).json({status: "error", error:err.message})
    }
}