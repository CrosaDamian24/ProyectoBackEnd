import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            // esto es para que mongoose no le cree un id al documento, ya que el id se lo ponemos nosotros
            _id: false,
            // objectId es un tipo de dato, al igual que boolean o number 
            product: mongoose.ObjectId,
            quantity: Number
        }],
        default:[]
    }
})


mongoose.set( 'strictQuery',false)
const cartModel = mongoose.model('carts',cartSchema)

export default cartModel
