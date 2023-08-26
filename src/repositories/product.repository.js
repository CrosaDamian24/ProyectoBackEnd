export default class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }
    getAll = async() => await this.dao.getAll()
    getAllPaginate = async(req,res) => await this.dao.getAllPaginate(req,res)
    getById = async(id) => await this.dao.getById(id)
    create = async(data) => await this.dao.create(data)
    update = async(id, data) => await this.dao.update(id, data)
    delete = async(id) => await this.dao.delete(id)
}