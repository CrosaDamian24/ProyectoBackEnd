import { CartService } from "../services/index.js";
import { ProductService } from "../services/index.js";
import { TicketService } from "../services/index.js";

export const getCartByIdController = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await CartService.getByIdPopulate(id);
    // const result = await cartModel.findById(id).populate("products.product").lean().exec();
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
};

export const createCartController = async (req, res) => {
  try {
    const newCart = req.body;
    // const result = await cartModel.create(newCart);
    const result = await CartService.create(newCart);
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
};

export const addProductInCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const carrito = await CartService.getById(cid);
    // const carrito = await cartModel.findById(cid);

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

    await CartService.updateOne({ _id: cid }, carrito);

    // await cartModel.updateOne({ _id: cid }, carrito);
    //
    // const result = await cartModel.findById(cid);
    const result = await CartService.getByIdPopulate(cid);

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
};

export const deleteProductInCartController = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    // const cart= await cartModel.findById(cid)
    const cart = await CartService.getById(cid);

    const indice = cart.products.findIndex((prod) => prod.product == pid);

    cart.products.splice(indice, 1);

    await CartService.updateOne({ _id: cid }, cart);
    // await cartModel.updateOne({_id: cid}, cart)

    // const result= await cartModel.findById(cid).populate("products.product")
    const result = await CartService.getByIdPopulate(cid);

    res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const clearCartController = async (req, res) => {
  try {
    const cid = req.params.cid;

    // await cartModel.updateOne({_id: cid}, { products: []})
    await CartService.updateOne({ _id: cid }, { products: [] });

    // const result= await cartModel.findById(cid).populate("products.product")
    const result = await CartService.getByIdPopulate(cid);

    res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const updateProductInCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const data = req.body;

    //  const cart = await cartModel.findById(cid);
    const cart = await CartService.getById(cid);

    const valor = data.quantity;

    cart.products.map((item) => {
      if (item.product == pid) {
        item.quantity = valor;
      }
    });

    //  await cartModel.updateOne({ _id: cid }, cart);
    await CartService.updateOne({ _id: cid }, cart);
    // const result= await cartModel.findById(cid).populate("products.product")
    const result = await CartService.getByIdPopulate(cid);

    res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const createTicketController = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await CartService.getByIdPopulate(cid);
  const totCompra = []

   const promises= cart.products.map(async (data) => {
      let listProduct = await ProductService.getById(
        data.product._id.toString()
      );

      if (data.quantity <= listProduct.stock) {
        // Actualizo el stock del producto
         totCompra.push(data.quantity*listProduct.price)
        const quantity = listProduct.stock - data.quantity;
        listProduct.stock = quantity;
        await ProductService.update(listProduct._id, listProduct);

        // Borro el producto del carrito
        // const cart= await CartService.getById(cid)

        const indice = await cart.products.findIndex(
          (prod) => prod.product == listProduct._id
        );

        await cart.products.splice(indice, 1);

        await CartService.updateOne({ _id: cart._id.toString() }, cart);
        
      }   
    }
     
    );
   
    Promise.all(promises)
    .then(async() => {
      // envía el arreglo todas las respuestas. Todas pasaron
  //     console.log(totCompra)
  //     const newTicket ={
  //       code: "007",
  //   //  purchase_datetime: Date,
  //    amount: totCompra.value,
  //    purchaser: "da"
  //  };
  //    await TicketService.create(newTicket);
      res.status(200).json({ status: "success", SinComprar: cart.products });
      

    }).catch((err) => {
      // hubo alguna respuesta. Informo.
      res.status(500).json({ status: "Error promesa", error: err.message });
    });
    // res.status(200).json({ status: "success", SinComprar: cart.products });

    // console.log(result.products.product)

 
    // res.status(200).json({ status: "success", payload: result });
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
};
