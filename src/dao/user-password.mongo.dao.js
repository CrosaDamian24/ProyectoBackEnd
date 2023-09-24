import userPasswordModel from '../models/user-password.model.js'

export default class UserPasswordDAO {
    create = async(data) => await userPasswordModel.create(data);
  
}
