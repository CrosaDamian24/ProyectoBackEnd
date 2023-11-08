

const cartLink = document?.getElementById("cart");
const hrefValue = cartLink?.getAttribute("href");
const cart = hrefValue?.match(/\/views\/carts\/(.+)/)[1];


// /carts/:cid/product/:pid
const addLink = async (_id) => {
    try {
        //  let select_file = req.query.file;
        console.log(_id)

    //   const res = await fetch(`/api/carts/${cart}/product/${_id}`, {
        const res = await fetch(`/views/carts/${cart}/product/${_id}`, {
     
            method: "POST", //
   
        })
        const result = await res.json()
        if (result.status === "error") throw new Error(result.error) //si el json, que ahora esta
        //  dentro de la const result, da error en su status, me tira un nuevo error y throw detiene la
        // ejecucion siguiente 
    } catch (error) {
        console.log(error)
    }
}