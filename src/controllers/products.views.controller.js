import productModel from "../models/product.model.js";

import { ProductService } from "../services/index.js";

export const getAllProductsViewsController = async (req, res) => {
  try {
    const products =  await ProductService.getAllPaginate(req,res) 
    // await getProducts(req, res);

    // const  user = req.session.user
    const user = req.user.user; //porque user lo metimos dentro de una variable user en utils, generateToken
  

    res.render("home", { products, user});
  } catch (err) {
    res.render("Error del servidor");
  }
};

export const realTimeProducts = async (req, res) => {
  // const products = await productModel.find().lean().exec();
  const products =await ProductService.getAll(req,res)
  // con FileSystem
  // const products = await manager.getProducts();
  res.render("realTimeProducts", { products });
};
