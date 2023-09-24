import userModel from '../models/user.model.js'

export default class UsertDAO {
    getAll = async() => await userModel.find().lean().exec();
    getOne = async(email) => await userModel.findOne(email).lean().exec()
  
}