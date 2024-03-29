export default class CartRepository {
    constructor(dao) {
        this.dao = dao
    }
    getByIdPopulate = async(id) => await this.dao.getById(id)
    create = async(data) => await this.dao.create(data)
    updateOne = async(id,data) => await this.dao.updateOne(id,data)
    getById = async(id) => await this.dao.getById(id)
    delete = async(id) => await this.dao.delete(id)

}