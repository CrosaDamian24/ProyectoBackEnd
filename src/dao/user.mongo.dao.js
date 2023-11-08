import userModel from '../models/user.model.js'

export default class UsertDAO {
    getAll = async() => await userModel.find().lean().exec();
    getById = async(id) => await userModel.findById(id).lean().exec();
    getOne = async(email) => await userModel.findOne(email).lean().exec()
    updateUser= async(id, data)=> await userModel.findByIdAndUpdate(id, data, { returnDocument: "after" })
    create = async(data) => await userModel.create(data)
    delete = async(id) => await userModel.findByIdAndDelete(id)

  
}