export default class UserPasswordRepository {
    constructor(dao) {
        this.dao = dao
    }

    create = async(data) => await this.dao.create(data)

}