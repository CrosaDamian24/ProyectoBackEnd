import passport from "passport"
import local from 'passport-local'
import { createHash, isValidPassword , extractCookie,  generateToken} from '../utils.js'
import GitHubStrategy from 'passport-github2'
import passport_jwt from "passport-jwt"
import { UserService, CartService } from "../services/index.js"
import config from "./config.js"

const LocalStrategy = local.Strategy
const JWTStrategy = passport_jwt.Strategy
const ExtractJWT = passport_jwt.ExtractJwt //extrae token de cookie

const JWT_PRIVATE_KEY = config.KEYPRIVATEJWT; 


const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done) => {
        const { first_name, last_name, email, age, role } = req.body
        try {
            const user = await UserService.getOne({ email: username })
            if (user) {
                console.log('User already exists')
                return done(null, false)
            }
            const cartForNewUser= await CartService.create({}) //creamos un carrito
            const newUser = {
                first_name, last_name, email, age, password: createHash(password),role                ,
                cart: cartForNewUser._id, //al nuevo usuario le asignamos el carrito que armamos mas arriba
                // role: (email === "adminCoder@coder.com")? "admin" : "user"
            }
            const result = await UserService.create(newUser)
            return done(null, result)
        } catch(err) {
            return done('error al obtener el user')
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(username, password, done) => {
        try {
            const user = await UserService.getOne({ email: username })
            if (!user ) {
               
                return done(null, false)
                
            }
           
            if (!isValidPassword(user, password)) {
            // console.log('pasa')
            return done(null, false)}
            const token = generateToken(user)
            // console.log(token)
            user.token = token
            
             return done(null, user)
            

        } catch(err) {

        }
    }))

// github
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.ed72e382a54a1474',
        clientSecret: '6664c567edf056eaa5a979513d66c384b86f54ee',
        callbackURL: 'http://localhost:8080/session/githubcallback'
    }, async(accessToken, refreshToken, profile, done) => {
        // console.log(profile)
        try {
            const user = await UserService.getOne({ email: profile._json.email })
            if (user){
            const token = generateToken(user)
            user.token = token
            return done(null, user)}
            else{
                const cartForNewUser= await CartService.create({})
                const newUser = await UserService.create({
                    first_name: profile._json.name,
                    email: profile._json.email,
                    cart: cartForNewUser._id,
                    role: "user"
                
                })
                const token = generateToken(newUser)
                newUser.token = token
                return done(null, newUser)
        }
        } catch(err) {
            return done(`Error to login with GitHub => ${err.message}`)
        }
    }))

    // JWT
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]), //extractCookie importado de utils
        secretOrKey: JWT_PRIVATE_KEY //constante de clave secreta importada de utils
    }, async (jwt_payload, done) => {
        done(null, jwt_payload)//devuelve contenido del jwt
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserService.getById(id)
        done(null, user)
    })

}

export default initializePassport