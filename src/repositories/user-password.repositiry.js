export default class UserPasswordRepository {
    constructor(dao) {
        this.dao = dao
    }

    create = async(data) => await this.dao.create(data)
    getUserPassword= async(data)=> await this.dao.getUserPassword(data)
    deleteOne=async (data)=> await this.dao.deleteOne(data)
}