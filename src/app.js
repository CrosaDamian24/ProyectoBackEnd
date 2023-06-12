import express from 'express';
import productsRouter from './routers/products.router.js'
import cartsRouter from './routers/carts.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js' 
import { Server } from 'socket.io'
import viewsRouter from './routers/views.router.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const httpServer = app.listen(8080, () => console.log('Server Up'))
const io = new Server(httpServer)

app.set('socketio',io)

//cofiguracion del motor e plantillas handlebars
app.use(express.static('./public'))
app.engine('handlebars', handlebars.engine())
// app.set('views', './views')
app.set('views',__dirname +'/views')
app.set('view engine','handlebars')

app.get('/',(req,res) => res.render('index'))
//productos
app.use('/api/products',  productsRouter)
//carts
app.use('/api/carts',  cartsRouter)
app.use('/products',viewsRouter)


//ejemplo handlebars
// app.get('/ejemplo', (req, res) => {
//     res.render('ejemplo',{ nombre_vista:'ejemplo'})
// })
// app.get('/motor', (req, res) => {
//     res.render('motor',{ nombre_vista:'motor'})
// })


io.on("connection",socket => {
    console.log('Nuevo coneccion')
    socket.on('products', data =>{
        io.emit('updateProducts',data)
    })

})

