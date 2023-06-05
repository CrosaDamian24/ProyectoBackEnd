import { Router } from "express";
import { ProductManager } from "../ProductManager.js";

const manager = new ProductManager("../products.json");

const router = Router();

//TODOS LOS PRODUCTOS Y POR LIMITE
router.get("/", async (req, res) => {
  let limite = req.query.limite;
  const productLimitados = await manager.getProducts();

  const productos = productLimitados.slice(0, Number(limite));

  if (!limite) res.send(await manager.getProducts());
  else {
    if(Number(limite)){
          res.send(productos);
    }else{
        res
        .status(400)
        .send({
          Status: "Error",
          Mensaje: "Debe ingresar un valor numerico como limite",
        })
    }
  
  }
});

//PRODUCTOS POR ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  !(await manager.getProductById(Number(id)))
    ? res
        .status(400)
        .send({
          Status: "Error",
          Mensaje: Number(id)
            ? `No existe el producto ${id}!`
            : "El id ingresado debe ser numerico",
        })
    : res.send(await manager.getProductById(Number(id)));
});

//AGREGO PRODUCTOS
router.post("/", async (req, res) => {
  let producto = req.body;

  if (
    !producto.title ||
    !producto.description ||
    !producto.price ||
    !producto.code ||
    !producto.stock ||
    !producto.status ||
    !producto.category
  ) {
    return res
      .status(400)
      .json({ Status: "Error", Error: "Campos incompletos" });
  } else
    await manager.addProduct(
      producto.title,
      producto.description,
      producto.price,
      producto.thumbnail,
      producto.code,
      producto.stock,
      producto.status,
      producto.category
    );
  return res.json({ Status: "Succes", Mensaje: "Producto creado" });
});

//ACTUALIZAR
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const producto = await manager.updateProduct(id, data);

  if (producto === false) {
    return res
      .status(400)
      .send({ Status: "Error", Mensaje: Number(id)?`No existe el producto con id ${id} para actualizar`:"Debe ingresar un ID numerico"});
  } else {
    res.json({ Status: "Succes", Mensaje: `Actualización exitosa de producto con id ${id}` });
  }
});

//BORRAR POR ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  // users = users.filter(item => item.id != id)
  const producto = await manager.deleteProduct(id);
  if (producto === false) {
    return res
      .status(400)
      .send({
        Status: "Error",
        Mensaje:  Number(id)?`No existe el producto con id ${id} para eliminar`:"Debe ingresar un ID numerico",
      });
  } else {
    res.json({ Status: "Succes",Mensaje: `Producto con id ${id} eliminado` });
  }
});

export default router;
