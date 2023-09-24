export default class UserRepository {
    constructor(dao) {
        this.dao = dao
    }

    getAll = async() => await this.dao.getAll()
    getOne = async(email) => await this.dao.getOne(email)

}