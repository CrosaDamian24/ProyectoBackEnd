import fs from "fs";

export class Cart {
  #error;
  constructor(path) {
    this.path = path;
    this.format = "utf-8";
    this.#error = undefined;
  }

  //Genero ID
  generateId = async () => {
    const carts = await this.getCarts();
    return carts.length === 0 ? 1 : carts[carts.length - 1].id + 1;
  };

  //Busqueda por ID
  getCartById = async (id) => {
    // traigo todos los carritos
    const carts = await this.getCarts();

    // busco el carrito por el id recibido
    const cart = carts.find((item) => item.id == id);
    return !cart ? false : cart;
  };

  //Agrego nuevo carro
  addCart = async (products) => {
    // traigo todos los carritos
    const cart = await this.getCarts();

    cart.push({
      id: await this.generateId(),
      products,
    });
    return await fs.promises.writeFile(
      this.path,
      JSON.stringify(cart, null, "\t")
    );
  };

  //Agrego en el carro el producto
  addInCart = async (cid, pid) => {
    // traigo todos los carritos
    const arrayCarts = await this.getCarts();

    //Busco si esta el carrito del cid que recibo
    const found = arrayCarts.find((item) => item.id == cid);

    if (found) {
      const indiceElemento = arrayCarts.findIndex((item) => item.id == cid);

      const arrayProducts = arrayCarts[indiceElemento].products;
      const indiceArray = arrayProducts.findIndex((item) => item.id == pid);

      if (indiceArray >= 0) {
        // Actualiza el producto
        let { quantity } = arrayProducts[indiceArray];
        quantity++;

        arrayProducts[indiceArray] = { ...arrayProducts[indiceArray], quantity: quantity };

        arrayCarts[indiceElemento] = {...arrayCarts[indiceElemento], products: [...arrayProducts],
        };
      } else {
        // Inserta el producto
        arrayCarts[indiceElemento].products.push({
          id: Number(pid),
          quantity: 1,
        });
      }

      return await fs.promises.writeFile(
        this.path,
        JSON.stringify(arrayCarts, null, "\t")
      );
    } else {
       return "ERROR";
    }
  };

  getCarts = async () => {
    return JSON.parse(await fs.promises.readFile(this.path, this.format));
  };

  // aca
  getCartProducts = async (cid) => {
    const cart = await this.getCartById(cid);

    return !cart ? false : cart.products;

  };
}

const cart = new Cart("./carts.json");
//  await manager.addProduct("Postre Oreo",
//  "Oreos, crema y dulce de leche",
//  1000,
//  "https://d3ugyf2ht6aenh.cloudfront.net/stores/593/476/products/postre-oreo1-baebe795d818cd332016267243846221-640-0.png",
//  "10001",
//  50);
// await manager.addProduct( "Postre Toddy",
// "Galletitas toddy, dulce y crema",
// 950,
// "https://lh6.googleusercontent.com/-0FLFbk4padM/VFVS1Q6fz8I/AAAAAAAAZFc/qIZhiLBfbRU/s640/blogger-image--229646297.jpg",
// "10001",8);

// manager.getProducts()
//  manager.getProductById(2)
// await manager.deleteProduct(2)
// await manager.updateProduct(2, "title", "Postre Toddy");
//  await manager.getProductByKey(950, "price");
