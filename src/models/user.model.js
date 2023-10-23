import moment from "moment/moment.js";
import mongoose from "mongoose";

const userCollection = "users"

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {type:String ,unique : true },
    age: Number,
    password: String,
    role: { type: String, default : "User"},
    cart: {type: mongoose.Schema.Types.ObjectId, ref: "carts"},
    last_connection : {type : String,default: moment().format("DD/MM/YYYY HH:mm:ss") , requiered : true},
    documents: {
        type: [{
            name: String,
            reference: String
        }],
        default: []
    }
})

mongoose.set("strictQuery", false)
const UserModel = mongoose.model(userCollection, userSchema)

export default UserModel