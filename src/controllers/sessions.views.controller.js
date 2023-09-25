import { generateToken } from "../utils.js";
export const getRegister = (req, res) => {
    res.render('sessions/register')
}

export const getLogin = (req, res) => {
    res.render('sessions/login')
}

export const getRestablecer = (req, res) => {
    res.render('sessions/restablecer')
}

export const getVerificarToken = (req, res) => {
    res.render('sessions/verify-token/:token')
}



export const getCurrent = (req, res) => {
   

    if(!req.user) return res.status(401).json({status: "error", error: "Sesión no detectada, inicia sesión"})
    const user = req.user.user;
    res.render("sessions/current", {user});
    

  };