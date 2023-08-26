import mongoose from "mongoose";

const ticketCollection = "ticket"

const ticketSchema = new mongoose.Schema({
    code: { type:String, requiered:true,unique:true},
    purchase_datetime: {type:Date, default:Date.now,required:true},
    amount: { type:Number, requiered:true},
    purchaser: {type:String, requiered:true}
 
})

mongoose.set("strictQuery", false)
const TicketModel = mongoose.model(ticketCollection, ticketSchema)

export default TicketModel