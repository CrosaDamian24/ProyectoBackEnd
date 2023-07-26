import express from 'express';
import productsRouter from './routers/products.router.js'
import cartsRouter from './routers/carts.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js' 
import { Server } from 'socket.io'
import viewsRouter from './routers/views.router.js'
import mongoose from 'mongoose';
import routerChat from "./routers/chat.router.js"
import sessionRouter from './routers/session.router.js'

import session from "express-session"; //DEPENDENCIA SESSION (guarda cookie)
import MongoStore from "connect-mongo"; //DEPENDENCIA guardar datos en MONGO


const app = express()
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

app.get('/',(req,res) => res.render('sessions/login'))


//productos




const MONGO_URI = "mongodb+srv://coder:coder@cluster0.xho3yyy.mongodb.net/"
const MONGO_DB_NAME = "ecommerce"


// MIDLEWARE CREA SESSION Y GUARDA EN DB MONGO
app.use(session({ //SESSION ES UN OBJETO
    store: MongoStore.create({ //ALMACENA EN MONGO
        mongoUrl: MONGO_URI,
        dbName: MONGO_DB_NAME,

    }),
    secret: "palabraclave",
    resave: true,
    saveUninitialized: true
}))


app.use('/views',viewsRouter)
app.use('/api/products',  productsRouter)
//carts
app.use('/api/carts',  cartsRouter)
app.use("/chat", routerChat)
app.use("/session", sessionRouter) //ruta crea session


mongoose.set('strictQuery', false)
try{
    await mongoose.connect('mongodb+srv://coder:coder@cluster0.xho3yyy.mongodb.net/ecommerce')
   
  
}catch(err){
    console.log(err.message)
}


const httpServer = app.listen(8080, () => console.log('Server Up'))
const io = new Server(httpServer)

app.set('socketio',io)


io.on("connection",socket => {
    console.log('Nuevo coneccion')
    socket.on('products', data =>{
        io.emit('updateProducts',data)
    })

})

