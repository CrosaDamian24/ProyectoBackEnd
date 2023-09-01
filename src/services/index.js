
import { Product } from '../dao/product.factory.js'   
// import ProductDAO from '../dao/product.mongo.dao.js'
// import CartDAO from '../dao/cart.mongo.dao.js'
import { Cart } from '../dao/cart.factory.js'
import TicketDAO from '../dao/ticket.mongo.dao.js'
import UserDAO from '../dao/user.mongo.dao.js'

import ProductRepository from '../repositories/product.repository.js'
import CartRepository from '../repositories/cart.repository.js'
import TicketRepository from '../repositories/ticket.repository.js'
import UserRepository from '../repositories/user.repository.js'



export const ProductService = new ProductRepository(new Product())
export const CartService = new CartRepository(new Cart() )
export const TicketService = new TicketRepository(new TicketDAO() )
export const UserService = new UserRepository(new UserDAO() )