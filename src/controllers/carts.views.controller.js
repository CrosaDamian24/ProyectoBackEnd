import cartModel from "../dao/models/cart.model.js";


  export const getCartByIdController = async (req, res) => {
    try {
      const cid = req.params.cid;
      const cart = await cartModel.findById(cid).populate("products.product"); //muestra carrito con su id y products
      console.log(cart)
      if(cart){

        const cartProducts = {
          products: cart.products.map((prod) => prod.toObject()),
        }; //creo un objeto con la prop products, y ahi mapeo el products de cart, pero esta vez transformados objetos, asi puedo acceder a sus propiedades en la vista
    
        // console.log(cartProducts.products);
    
        res.render("cart", { cartProducts, lean: true });
      }else{
        res.status(401).render('errors/base', { error: "No existe el carrito" })
        // res.send({ error: 'No existe el carrito!'})
      }

    } catch (error) {
      res.render("Error del servidor");
    }
  }