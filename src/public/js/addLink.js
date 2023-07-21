const addLink = async (_id) => {
    try {
        console.log(_id)
        const cart = "64a9b8e3745ff633fc7a3142"
        const res = await fetch(`/api/carts/${cart}/product/${_id}`, {
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