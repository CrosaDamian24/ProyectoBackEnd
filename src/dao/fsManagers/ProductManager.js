import fs from "fs";

export class ProductManager {
  #error;
  constructor(path) {
    this.path = path;
    this.format = "utf-8";
    this.#error = undefined;
  }
  //Genero ID
  generateId = async () => {
    const products = await this.getProducts();
    return products.length === 0 ? 1 : products[products.length - 1].id + 1;
  };

  //Busqueda por ID
  getProductById = async (id) => {
    const products = await this.getProducts();
    const product = products.find((item) => item.id === id);
    return !product ? false: product;
  };

    //Busqueda por KEY
    getProductByKey  = async (value, key) => {
        const products = await this.getProducts();

        const product = products.filter((item) => item[key] === value);
    
        return console.log(product.length === 0 ? "Not Found" : product);
      };
  //Borro por ID
  deleteProduct = async (id) => {
    const products = await this.getProducts();

    const found = products.find((item) => item.id == id);

    return found
      ? await fs.promises.writeFile(
          this.path,
          JSON.stringify(
            products.filter((item) => item.id != id),
            null,
            "\t"
          )
        )
      : false
  };


   //Actualizo por ID
  updateProduct = async (id, contenido) => {
    const products = await this.getProducts(id);

    const found = products.find((item) => item.id == id);
  
    if (found) {
      const indiceElemento = products.findIndex((item) => item.id == id);

      products[indiceElemento] = {
        ...products[indiceElemento],
        ...contenido,
      };

      return await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
    } else {
      return false
    }
  };

  #validateProduct = (title, description, price, thumbnail, code, stock,status, category) => {
    if (
      !title ||
      !description ||
      !price ||
      !code ||
      !stock ||
      !status||
      !category
    ) {
      this.#error = `[${title}]: campos incompletos`;
      return;
    }
  };

  addProduct = async (title, description, price, thumbnail, code, stock,status, category) => {
    this.#validateProduct(title, description, price, thumbnail, code, stock,status, category);

    if (this.#error === undefined) {
      const products = await this.getProducts();

      products.push({
        id: await this.generateId(),
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status, 
        category
      });
      return await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
    } else {
      console.log(this.#error);
    }
  };

   getProducts = async () => {
    return JSON.parse(await fs.promises.readFile(this.path, this.format));
  };
}

const manager = new ProductManager("../../../products.json");

