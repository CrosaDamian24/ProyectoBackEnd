import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new mongoose.Schema({
    title : { type:String, requiered : true},
    description : { type:String, requiered : true},
    price : { type:Number, requiered : true},
    code : { type:String, unique : true ,requiered : true},
    status : { type: Boolean, default : true},
    stock : { type: Number, requiered : true},
    category : { type : String, requiered : true},
    thummbnails : { type: [String], default : []},
    owner : { type: String, default : "admin" }
})

productSchema.plugin(mongoosePaginate)
mongoose.set( 'strictQuery',false)
const productModel = mongoose.model('products',productSchema)

export default productModel