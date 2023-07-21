import { Router } from "express";
import { ProductManager } from "../dao/fsManagers/ProductManager.js";
import productModel from "../dao/models/product.model.js";



const manager = new ProductManager("../products.json");

const router = Router();

//TODOS LOS PRODUCTOS Y POR limit
router.get("/", async (req, res) => {
  try{
    const limit = req.query.limit?req.query.limit:10
    const page = req.query.page?req.query.page:1
    const stock = req.query.stock?req.query.stock:0
    const category = req.query.category?req.query.category:''
    const sort = req.query.sort || 0

    let query={};
    if(category){
        query.category={ $regex: new RegExp(category), $options: "i" }
    }
    if(stock){
      query.stock= {$lte: stock}
    }
 
    // const result = await productModel.find().limit(limit).lean().exec()
    const result = await productModel.paginate( query,{ limit: limit, page: page, sort: { price: Number(sort) } })

    res.status(200).json({status:'succes', payload : result})
  }catch(err){
    res.status(500).json({status:'error', error: err.message})
  }

  // con FileSystem
  // let limit = req.query.limit;
  // const productLimitados = await manager.getProducts();

  // const productos = productLimitados.slice(0, Number(limit));

  // if (!limit){
  //   req.app.get('socketio').emit('updateProduct',await manager.getProducts())
  //   res.send(await manager.getProducts());
  // } 

  // else {
  //   if(Number(limit)){
  //         res.send(productos);
  //   }else{
  //       res
  //       .status(400)
  //       .send({
  //         Status: "Error",
  //         Mensaje: "Debe ingresar un valor numerico como limit",
  //       })
  //   }
  
  // }
});

//PRODUCTOS POR ID
router.get("/:id", async (req, res) => {

  try{
    const id = req.params.id
    const data = req.body
    const result = await productModel.findById(id).lean().exec()
    if (result === null){
      return res.status(404).json({ status : 'error', error : 'Not found'})
    } 
      res.status(200).json( { status : 'succes', payload : result})
  }
    catch(err){
      res.status(500).json( {status: 'error', error : err.message})
    }

   // con FileSystem
  // const id = req.params.id;

  // !(await manager.getProductById(Number(id)))
  //   ? res
  //       .status(400)
  //       .send({
  //         Status: "Error",
  //         Mensaje: Number(id)
  //           ? `No existe el producto ${id}!`
  //           : "El id ingresado debe ser numerico",
  //       })
  //   : res.send(await manager.getProductById(Number(id)));
});

//AGREGO PRODUCTOS
router.post("/", async (req, res) => {
  try{
    const product = req.body
    const result = await productModel.create(product)
    const products = await productModel.find().lean().exec()

    req.app.get('socketio').emit('updateProducts',products)
    res.status(201).json({ status : 'succes', payload : result})

  }catch(err){
    res.status(500).json({ status : 'error', error : err.message})

  }

  // con FileSystem
  // let producto = req.body;

  // if (
  //   !producto.title ||
  //   !producto.description ||
  //   !producto.price ||
  //   !producto.code ||
  //   !producto.stock ||
  //   !producto.status ||
  //   !producto.category
  // ) {
  //   return res
  //     .status(400)
  //     .json({ Status: "Error", Error: "Campos incompletos" });
  // } else
  //   await manager.addProduct(
  //     producto.title,
  //     producto.description,
  //     producto.price,
  //     producto.thumbnail,
  //     producto.code,
  //     producto.stock,
  //     producto.status,
  //     producto.category
  //   );
  //   const products = await manager.getProducts()
  //   req.app.get('socketio').emit('updateProducts',products)
  // return res.json({ Status: "Succes", Mensaje: "Producto creado" });
});

//ACTUALIZAR
router.put("/:id", async (req, res) => {
  try {
      const id = req.params.id
      const data = req.body
      const result = await productModel.findByIdAndUpdate(id,data,{ returnDocument : 'after'})
      if (result === null){
        return res.status(404).json({ status : 'error', error: 'Not found'})
      }
      const products = await productModel.find().lean().exec()
         req.app.get('socketio').emit('updateProducts',products)
      res.status(200).json({ status : 'succes', payload : result})
  }catch(err){
    res.status(500).json({ status : 'error', error : err.message})
  }
   // con FileSystem
  // const id = req.params.id;
  // const data = req.body;

  // const producto = await manager.updateProduct(id, data);
  // req.app.get('socketio').emit('updateProducts',await manager.getProducts())

  // if (producto === false) {
  //   return res
  //     .status(400)
  //     .send({ Status: "Error", Mensaje: Number(id)?`No existe el producto con id ${id} para actualizar`:"Debe ingresar un ID numerico"});
  // } else {
  //   res.json({ Status: "Succes", Mensaje: `Actualización exitosa de producto con id ${id}` });
  // }
});

//BORRAR POR ID
router.delete("/:id", async (req, res) => {
  
  try {
    const id = req.params.id
    const result = await productModel.findByIdAndDelete(id)
    if (result === null){
      return res.status(404).json({ status : 'error', error: 'Not found'})
    }
    const products = await productModel.find().lean().exec()
       req.app.get('socketio').emit('updateProducts',products)
    res.status(200).json({ status : 'succes', payload : result})
}catch(err){
  res.status(500).json({ status : 'error', error : err.message})
}
     // con FileSystem
  // const id = req.params.id;
  // // users = users.filter(item => item.id != id)

  // const producto = await manager.deleteProduct(id);
  // req.app.get('socketio').emit('updateProducts',await manager.getProducts())
  // if (producto === false) {
  //   return res
  //     .status(400)
  //     .send({
  //       Status: "Error",
  //       Mensaje:  Number(id)?`No existe el producto con id ${id} para eliminar`:"Debe ingresar un ID numerico",
  //     });
  // } else {
   
  //   res.json({ Status: "Succes",Mensaje: `Producto con id ${id} eliminado` });
  // }
});

export default router;
