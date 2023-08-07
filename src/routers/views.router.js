import { Router } from "express";
// con FileSystem
// import { ProductManager } from "../dao/fsManagers/ProductManager.js";
import productModel from "../dao/models/product.model.js";
import cartModel from "../dao/models/cart.model.js";
import passport from "passport";
// import session from "express-session";

// con FileSystem
// const manager = new ProductManager("../products.json");

const router = Router();

// router.get("/", async (req, res) => {
//   const products = await productModel.find().lean().exec()
//    // con FileSystem
//   // const products = await manager.getProducts();
//   res.render("home", { products });
// });



router.get("/products", async (req, res) => {
  try {
    // const page= req.query.page || 1
    // const limit= req.query.limit || 10
    const limit = req.query.limit ? req.query.limit : 10;
    const page = req.query.page ? req.query.page : 1;
    const stock = req.query.stock ? req.query.stock : 0;
    const category = req.query.category ? req.query.category : "";
    const sort = req.query.sort || 0;

    let query = {};
    if (category) {
      query.category = { $regex: new RegExp(category), $options: "i" };
    }
    if (stock) {
      query.stock = { $lte: stock };
    }

    const products = await productModel.paginate(query, {
      limit: limit,
      page: page,
      sort: { price: Number(sort) },
      lean: true,
    });
    // const products= await productModel.paginate({}, {page, limit, lean:true}) //lean pasa datos con formato de mongo a objetos de js

    products.prevLink = products.hasPrevPage
      ? `/views/products?page=${products.prevPage}&limit=${limit}`
      : "";

    products.nextLink = products.hasNextPage
      ? `/views/products?page=${products.nextPage}&limit=${limit}`
      : "";


//  console.log(req.session.passport.user)
   
      // const  user = req.session.user
      const user = req.user.user //porque user lo metimos dentro de una variable user en utils, generateToken 


    res.render("home", { products,user});
  } catch (err) {
    res.render("Error del servidor");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productModel.find().lean().exec();
  // con FileSystem
  // const products = await manager.getProducts();

  res.render("realTimeProducts", { products });
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartModel.findById(cid).populate("products.product"); //muestra carrito con su id y products

    const cartProducts = {
      products: cart.products.map((prod) => prod.toObject()),
    }; //creo un objeto con la prop products, y ahi mapeo el products de cart, pero esta vez transformados objetos, asi puedo acceder a sus propiedades en la vista

    console.log(cartProducts.products);

    res.render("cart", { cartProducts, lean: true });
  } catch (error) {
    res.render("Error del servidor");
  }
});

// router.get("/", (req, res) => {
//   // res.render("index", {});
//   // res.render("/session/login", {});
// });

export default router;
