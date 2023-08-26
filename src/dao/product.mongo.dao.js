import productModel from '../models/product.model.js'

export default class ProductDAO {
    getAll = async() => await productModel.find().lean().exec();
    getAllPaginate = async (req,res)=>{
        const limit = req.query.limit?req.query.limit:10
        const page = req.query.page?req.query.page:1
        const stock = req.query.stock?req.query.stock:0
        const category = req.query.category?req.query.category:''
        const sort = req.query.sort || 0
      
        let query={};
        if(category){
            query.category={ $regex: new RegExp(category), $options: "i" }
        }
        if(stock){
          query.stock= {$lte: stock}
        }
      
        // const result = await productModel.find().limit(limit).lean().exec()
        const result =   await productModel.paginate( query,{ limit: limit, page: page, sort: { price: Number(sort) },
         lean: true, })
      result.limit = limit
        // await productModel.paginate({}, {page, limit, lean:true}) //lean pasa datos con formato de mongo a objetos de js
        // const limit = products.limit
 
    result.prevLink = result.hasPrevPage
      ? `/views/products?page=${result.prevPage}&limit=${limit}`
      : "";

    result.nextLink = result.hasNextPage
      ? `/views/products?page=${result.nextPage}&limit=${limit}`
      : "";
      // 
        return result
    }
    getById = async(id) => await productModel.findById(id).lean().exec();
    create = async(data) => await productModel.create(data)
    update = async(id,data) => await  productModel.findByIdAndUpdate(id, data,{ returnDocument:'after'}) 
    delete = async(id) => await productModel.findByIdAndDelete(id)

}