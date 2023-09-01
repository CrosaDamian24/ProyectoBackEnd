import cartModel from   '../models/cart.model.js'

export default class CartDAO {
    getByIdPopulate = async(id) => await cartModel.findById(id).populate("products.product").lean().exec();
    // getByIdPopulate = async(id) => await cartModel.findById(id).populate("products.product").lean().exec();
    getById = async(id) => await cartModel.findById(id)
    create = async(data) => await cartModel.create(data);
    updateOne = async(id,data) => await cartModel.updateOne(id,data,{ new:true})

}