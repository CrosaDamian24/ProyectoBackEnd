import ticketModel from '../models/ticket.model.js'

export default class TickettDAO {
    // getAll = async() => await productModel.find().lean().exec();
    create = async(data) => await ticketModel.create(data)
    // update = async(id,data) => await  productModel.findByIdAndUpdate(id, data,{ returnDocument:'after'}) 
    // delete = async(id) => await productModel.findByIdAndDelete(id)

}