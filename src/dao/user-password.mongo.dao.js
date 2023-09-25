import userPasswordModel from '../models/user-password.model.js'

export default class UserPasswordDAO {
    create = async(data) => await userPasswordModel.create(data);
    getUserPassword= async(data) => await userPasswordModel.findOne(data).lean().exec()
    deleteOne =async (data)=> await userPasswordModel.deleteOne(data)
  
}
