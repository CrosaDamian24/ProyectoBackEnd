export const generateErrorInfo = (product)=> {

//    console.log(error)
    return `
    Uno o mas properties están incompletos o son inválidos.
    Lista de propiedades obligatorias:-
        - title: Must be a string. (${product.title})
        - description: Must be a string. (${product.description})
        - price: Must be a number. (${product.price})
        - code: Must be a number and unique. (${product.price})
        - stock: Must be a number. (${product.stock})
        - category: Must be a string. (${product.category})
    `   
          
}

export const getCartErrorInfo = (id) =>{
    return `El carrito ${id} no existe en la base de datos`
}