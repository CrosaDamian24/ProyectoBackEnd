import express from 'express';
import productsRouter from './routers/products.router.js'
import cartsRouter from './routers/carts.router.js'
import routerMoking from './routers/moking.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js' 
import { Server } from 'socket.io'
import viewsRouter from './routers/products.views.router.js'
import cartsViewsRouter from './routers/carts.views.router.js'
import mongoose from 'mongoose';
import routerChat from "./routers/chat.router.js"
import sessionsRouter from './routers/sessions.router.js'
import sessionsViewsRouter from './routers/sessions.views.router.js'
import session from "express-session"; //DEPENDENCIA SESSION (guarda cookie)
import MongoStore from "connect-mongo"; //DEPENDENCIA guardar datos en MONGO
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import { passportCall ,handlePolicies } from "./middleware/middleware.js";
import cookieParser from "cookie-parser";
import config from './config/config.js';
import messagesModel from "./models/messages.model.js";
import errorHandler from './middleware/error.js'
import logger from './logger.js'


const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//cofiguracion del motor e plantillas handlebars
// app.use(express.static('./public'))
app.use(express.static(__dirname + "/public"))
app.engine('handlebars', handlebars.engine())
// app.set('views', './views')
app.set('views',__dirname +'/views')
app.set('view engine','handlebars')

// app.get('/',(req,res) => res.render('index'))
// app.get('/mockingproducts')

app.get('/',(req,res) => res.render('sessions/login'))


//productos





const MONGO_CONNECT = config.connect


// MIDLEWARE CREA SESSION Y GUARDA EN DB MONGO
app.use(session({ //SESSION ES UN OBJETO
    // store: MongoStore.create({ //ALMACENA EN MONGO
    //     mongoUrl: MONGO_URI,
    //     dbName: MONGO_DB_NAME,

    // }),
    secret: "palabraclave",
    resave: true,
    saveUninitialized: true
   
}))

// passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())



app.use('/views',passportCall("jwt"), viewsRouter)
app.use('/views',passportCall("jwt"), handlePolicies(['USER']), cartsViewsRouter)
app.use('/api/products',passportCall("jwt"),productsRouter)
//carts
app.use('/api/carts',passportCall("jwt"),handlePolicies(['USER']),cartsRouter)
app.use("/chat",passportCall("jwt"), handlePolicies(['USER']), routerChat)
app.use("/session",sessionsRouter) //ruta crea session
app.use("/session",passportCall("jwt"), sessionsViewsRouter) //ruta crea session
app.use("/mockingproducts", routerMoking) 
app.use(errorHandler)
mongoose.set('strictQuery', false)
try{
    await mongoose.connect(MONGO_CONNECT)
   
  
}catch(err){
    console.log(err.message)
}

const httpServer = app.listen(config.port, () => logger.info('Server Up!'))
//  console.log('Server Up')
const io = new Server(httpServer)

app.set('socketio',io)


io.on("connection",socket => {
    // console.log('Se actualiza realtimeproducts')
    socket.on('products', data =>{
        io.emit('updateProducts',data)
    })
    console.log("New client connected")
        socket.on("message", async data => {
        await messagesModel.create(data)
        let messages = await messagesModel.find().lean().exec()
        io.emit("logs", messages)
        })

})

// socketServer.on("connection", socket => {
//     console.log("New client connected")
//     socket.on("message", async data => {
//     await messagesModel.create(data)
//     let messages = await messagesModel.find().lean().exec()
//     socketServer.emit("logs", messages)
//     })
// })

