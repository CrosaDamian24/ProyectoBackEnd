import config from "../config/config.js";

export let Product

switch (config.PERSISTENCE) {
    case 'MONGO':
        const { default: ProductDAO } = await import('../dao/product.mongo.dao.js')
        Product = ProductDAO
        break;
    case 'FILE':
        const { default: ProductFileDAO } = await import('../dao/product.file.dao.js')
        Product = ProductFileDAO
        break;

    default:
        break;
}