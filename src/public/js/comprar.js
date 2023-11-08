
// /carts/:cid/product/:pid
const comprar = async (_id) => {
    try {
        //  let select_file = req.query.file;
       

        const res = await fetch(`/api/carts/${_id}/purchase`, {
   
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