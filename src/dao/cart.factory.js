import config from "../config/config.js";

export let Cart

switch (config.PERSISTENCE) {
    case 'MONGO':
        const { default: CartDAO } = await import('../dao/cart.mongo.dao.js')
        Cart = CartDAO
        break;
    case 'FILE':
        const { default: CartFileDAO } = await import('../dao/cart.file.dao.js')
        Cart = CartFileDAO
        break;

    default:
        break;
}