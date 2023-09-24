import mongoose, { mongo } from "mongoose"

const userPasswordCollection = "userPasswords"

const userPasswordSchema = new mongoose.Schema({
    email: {type:String, ref: "user"},
    token: { type:String, requiere:true},
    createdAt : {type : Date,default: Date.now, expireAfterSeconds:3600}
})

mongoose.set("strictQuery",false)
const userPasswordModel = mongoose.model(userPasswordCollection, userPasswordSchema)

export default userPasswordModel

