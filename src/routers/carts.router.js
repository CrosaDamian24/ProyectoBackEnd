import express from "express";
import { Router } from "express";
import { Cart } from "../dao/fsManagers/Cart.js";
import cartModel from "../dao/models/cart.model.js";
import productModel from "../dao/models/product.model.js";
// con FileSystem
// import { ProductManager } from '../dao/fsManagers/ProductManager.js'

const cart = new Cart("../carts.json");
// const manager = new ProductManager('../products.json');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = Router();

//PRODUCTOS POR ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const result = await cartModel.findById(id).populate("products.product").lean().exec();
    if (result === null) {
      return res.status(404).json({ status: "error", error: "Not found" });
    }
    res.status(200).json({ status: "succes", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
  // con FileSystem
  // const cid = req.params.id

  // if (!(await cart.getCartProducts(Number(cid)))) res.status(400).send({Status:"Error",Mensaje : Number(cid)? `No existe el carrito ${cid}!`:"Debe ingresar un ID numerico"})
  // else{
  //     res.send(await cart.getCartProducts(Number(cid)))
  // }
});

//AGREGO carrito
router.post("/", async (req, res) => {
  try {
    const newCart = req.body;
    const result = await cartModel.create(newCart);
    res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
  // con FileSystem
  // let carrito = req.body;

  // if(!carrito.products){
  //     return res.status(400).send({Status:"Error",Mensaje:"Campos incompletos"})
  // }else
  //  await cart.addCart(carrito.products)
  // return res.send({Status:"Succes", Mensaje:"Carrito creado con éxito!"})
});

//AGREGO productos a carrito existente
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const carrito = await cartModel.findById(cid);

    let acum = 0;
    // carrito.products.map(function(dato){
    carrito.products.map((dato) => {
      if (dato.product == pid) {
        acum++;
        dato.quantity++;
      }
    });

    if (acum === 0) {
      carrito.products.push({ product: pid, quantity: 1 });
    }

    await cartModel.updateOne({ _id: cid }, carrito);
    //
    const result = await cartModel.findById(cid);

    res.status(200).json({ status: "succes", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }

  // con FileSystem
  // const cid = req.params.cid
  // const pid = req.params.pid

  // const carro = await cart.getCartById(Number(cid))
  // const product = await manager.getProductById(Number(pid))

  // if (!product ){
  //     return res.status(400).send({Status:"Error",Mensaje:Number(pid)?`No existe el producto ${pid}!`:"Debe ingresar un id de producto numerico"})
  // }
  // else{
  //     if(!carro){
  //         return res.status(400).send({Status:"Error",Mensaje:Number(cid)?`No existe el carrito ${cid}!`:"Debe ingresar un id de carrito numerico"})
  //     }else

  //        await cart.addInCart(cid,pid)
  //         return res.send({Status:"Succes",Mensaje:"Producto agregado al carrito"})
  // }
});

// BORRO PRODUCTO DEL CARRITO
router.delete("/:cid/product/:pid", async(req, res)=>{
  try {
      const cid= req.params.cid
      const pid= req.params.pid
      const cart= await cartModel.findById(cid)
      
       const indice =  cart.products.findIndex( prod => prod.product == pid)

      cart.products.splice((indice),1)
     
      await cartModel.updateOne({_id: cid}, cart)
      
      const result= await cartModel.findById(cid).populate("products.product")

      res.status(200).json({status: "success", payload: result})
  } catch (err) {
      res.status(500).json({ status: "error", error: err.message})
  }
})

// BORRO TODOS LOS PRODUCTOS DEL CARRITO
router.delete("/:cid", async(req, res)=>{
  try {
      const cid= req.params.cid

        
      await cartModel.updateOne({_id: cid}, { products: []})
      
      const result= await cartModel.findById(cid).populate("products.product")

      res.status(200).json({status: "success", payload: result})
  } catch (err) {
      res.status(500).json({ status: "error", error: err.message})
  }
})

//Actualizo cantidad de productos
router.put("/:cid/product/:pid", async(req, res)=>{
  try {
      const cid= req.params.cid
      const pid= req.params.pid
      const data = req.body

       const cart = await cartModel.findById(cid);
      
      const valor = data.quantity

      cart.products.map((item) => {
        if (item.product == pid) {
    
          item.quantity = valor
        }
      });
  
       await cartModel.updateOne({ _id: cid }, cart);
      
      const result= await cartModel.findById(cid).populate("products.product")

      res.status(200).json({status: "success", payload: result})
  } catch (err) {
      res.status(500).json({ status: "error", error: err.message})
  }
})

export default router;
