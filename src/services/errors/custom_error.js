export default class CustomError {
    static createError({ name='Error', cause, message, code }) {
        console.log("pasa1")
         const error = new Error(message, { cause })
        
        // const error = new Error(message)
    
        error.name = name
        error.code = code
   
        throw error
    }
}