export default class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }
    // getByIdPopulate = async(id) => await this.dao.getById(id)
    getAll = async() => await this.dao.getAll()
    create = async(data) => await this.dao.create(data)
    // updateOne = async(id,data) => await this.dao.updateOne(id,data)
    // getById = async(id) => await this.dao.getById(id)

}