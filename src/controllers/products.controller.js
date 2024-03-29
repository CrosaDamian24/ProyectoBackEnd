import { ProductService } from "../services/index.js";
import CustomError from "../services/errors/custom_error.js";
import EErros from "../services/errors/enums.js";
import { generateErrorInfo } from "../services/errors/info.js";
import nodemailer from "nodemailer";
import config from "../config/config.js";

export const getAllProductsController = async (req, res) => {
  try {
    // const result = await getProducts(req,res)
    const result = await ProductService.getAllPaginate(req, res);
    res.status(200).json({ status: "succes", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
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
};

export const getProductByIdController = async (req, res) => {
  try {
    const id = req.params.id;

    // const result = await productModel.findById(id).lean().exec()
    const result = await ProductService.getById(id);
    if (result === null) {
      return res.status(404).json({ status: "error", error: "Not found" });
    }
    res.status(200).json({ status: "succes", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
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
};

export const createProductController = async (req, res, next) => {
  try {
    const product = req.body;
    const senDocument = req.file;

    if (req.user.user.role == "premium") {
      //si usuario premium crea el producto, se gusrda su email en el campo owner
      product.owner = req.user.user.email;
    }
    if (senDocument) product.thummbnails = req.file.filename;

    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.stock ||
      !product.category
    ) {
      CustomError.createError({
        name: "Product creation error",
        cause: generateErrorInfo(product),
        message: "Error trying to create a product",
        code: EErros.INVALID_TYPES_ERROR,
      });
    }
    const result = await ProductService.create(product);
    const products = await ProductService.getAll(req, res);

    req.app.get("socketio").emit("updateProducts", products);
    res.status(201).json({ status: "succes", payload: result });
  } catch (error) {
    next(error);
    // res.status(500).json({ status : 'error', error : err.message})
  }
  // const product = req.body
  // if (!product.title || !product.description || !product.price || !product.code ||
  //   !product.stock || !product.category){
  //   CustomError.createError({
  //     name: "Product creation error",
  //     cause: generateErrorInfo(product),
  //     message:  "Error trying to create a product",
  //     code: EErros.INVALID_TYPES_ERROR
  // })
  // }

  //  res.status(500).json({ status : 'error', error : err.message})
  // if (err.code == 11000){

  //   console.log("paasa")
  // }
};

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

export const updateProductController = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    // busco los datos del poducto
    const producto = await ProductService.getById(id);

    if (req.user.user.role == "premium") {
      if (producto.owner != req.user.user.email) {
        return res.status(401).json({ status: "error", error: "Unauthorized" });
      }
    }

    const result = await ProductService.update(id, data);
    if (result === null) {
      return res.status(404).json({ status: "error", error: "Not found" });
    }
    const products = await ProductService.getById(id);
    req.app.get("socketio").emit("updateProducts", products);
    res.status(200).json({ status: "succes", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
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
};

export const deleteProductController = async (req, res) => {
  try {
    const id = req.params.id;
    // busco los datos del poducto
    const producto = await ProductService.getById(id);
    if (producto) {
      const nombre = producto.title;
      const email = producto.owner;

      if (req.user.user.role == "premium") {
        if (producto.owner != req.user.user.email) {
          return res
            .status(401)
            .json({ status: "error", error: "Unauthorized" });
        }
      }
      // const result = await productModel.findByIdAndDelete(id)

      const result = await ProductService.delete(id);
      if (result === null) {
        return res.status(404).json({ status: "error", error: "Not found" });
      }
      // Envio el mail avisando al usuario premium dueño del producto que se elimino
      if (email) {
        const mailerConfig = {
          // uri:wtimeoutMS,
          service: "gmail",
          auth: {
            user: config.NODEMAILER_USER,
            pass: config.NODEMAILER_PASS,
          },
        };
        let transporter = nodemailer.createTransport(mailerConfig);
        let message = {
          from: config.NODEMAILER_USER,
          to: email,
          subject: "Producto Eliminado",
          html: `<h1>Hola </h1> <hr/> Su producto ${nombre} ha sido eliminado del catalogo`,
        };

        await transporter.sendMail(message);
      }
      const products = await ProductService.getAll();
      req.app.get("socketio").emit("updateProducts", products);
      res.status(200).json({ status: "succes", payload: result });
      // }
    }
    return res
      .status(200)
      .json({ status: "error", error: "El producto no existe" });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
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
};
