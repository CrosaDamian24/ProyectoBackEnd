import express from 'express';
import { Router } from 'express'
import { Cart } from '../Cart.js';
import { ProductManager } from '../ProductManager.js'

const cart = new Cart('../carts.json');
const manager = new ProductManager('../products.json');

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const router = Router()

//PRODUCTOS POR ID 
router.get('/:id', async (req,res)=>{
    const cid = req.params.id

    if (!(await cart.getCartProducts(Number(cid)))) res.status(400).send({Status:"Error",Mensaje : Number(cid)? `No existe el carrito ${cid}!`:"Debe ingresar un ID numerico"})
    else{
        res.send(await cart.getCartProducts(Number(cid)))
    }
})

//AGREGO carrito
router.post('/', async (req,res)=>{
    let carrito = req.body;

    if(!carrito.products){
        return res.status(400).send({Status:"Error",Mensaje:"Campos incompletos"})
    }else 
     await cart.addCart(carrito.products)
    return res.send({Status:"Succes", Mensaje:"Carrito creado con éxito!"})

})

//AGREGO productos a carrito existente
router.post('/:cid/product/:pid', async (req,res)=>{
    const cid = req.params.cid
    const pid = req.params.pid

    const carro = await cart.getCartById(Number(cid))
    const product = await manager.getProductById(Number(pid))
    
    if (!product ){
        return res.status(400).send({Status:"Error",Mensaje:Number(pid)?`No existe el producto ${pid}!`:"Debe ingresar un id de producto numerico"})
    }
    else{
        if(!carro){
            return res.status(400).send({Status:"Error",Mensaje:Number(cid)?`No existe el carrito ${cid}!`:"Debe ingresar un id de carrito numerico"})
        }else
      
           await cart.addInCart(cid,pid)
            return res.send({Status:"Succes",Mensaje:"Producto agregado al carrito"})
    }

})


export default router