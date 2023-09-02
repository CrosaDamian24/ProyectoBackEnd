

const cartLink = document?.getElementById("cart");
const hrefValue = cartLink?.getAttribute("href");
const cart = hrefValue?.match(/\/views\/carts\/(.+)/)[1];
//  const cart = hrefValue?.match(/\/api\/carts\/(.+)/)[1];

// window.onload = inicio;

// function inicio() {
// //    console.log('El nombre de usuario o clave está vacío')
//    const role = document?.getElementById("role");
//    const boton = document?.getElementById("boton");
//    const hrefValue1 = boton?.getAttribute("disabled");
// const hrefValue = role?.getAttribute("href");
// const rol = hrefValue?.match(/\/views\/carts\/(.+)/)[1];
// console.log((rol==='admin')?"false":"true")
// boton?.setAttribute("disabled","true")
// console.log(boton)

// function myFunction() {
//     document.getElementById("myH1").setAttribute("class", "democlass"); 
//   }

// return (rol==='admin')?false:true



// }

const prueba =  ()=>{
   inicio()
 
}

// /carts/:cid/product/:pid
const addLink = async (_id) => {
    try {
        //  let select_file = req.query.file;
        

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