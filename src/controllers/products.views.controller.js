import productModel from "../dao/models/product.model.js";

export const getAllProductsViewsController = async (req, res) => {
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
  }

export const realTimeProducts = async (req, res) => {
    const products = await productModel.find().lean().exec();
    // con FileSystem
    // const products = await manager.getProducts();
  
    res.render("realTimeProducts", { products });
  }

