import express from 'express';
import productsRouter from './routers/products.router.js'
import cartsRouter from './routers/carts.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js' 
import { Server } from 'socket.io'
import viewsRouter from './routers/views.router.js'
import mongoose from 'mongoose';
import routerChat from "./routers/chat.router.js"

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))



//cofiguracion del motor e plantillas handlebars
app.use(express.static('./public'))
app.engine('handlebars', handlebars.engine())
app.set('views', './views')
// app.set('views',__dirname +'/views')
app.set('view engine','handlebars')

app.get('/',(req,res) => res.render('index'))
//productos
app.use('/views',viewsRouter)
app.use('/api/products',  productsRouter)
//carts
app.use('/api/carts',  cartsRouter)
app.use("/chat", routerChat)



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