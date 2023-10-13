import chai from "chai";
import supertest from "supertest";
import config from "../config/config.js";

//variables de entorno
const PORT = config.port
const COOKIE_NAME = config.COOKIENAMEJWT

const expect = chai.expect;
const requester = supertest(`http://localhost:${PORT}`);

describe("Testing Ecommers de Cart api/carts", () => {
    let cookie;

    const user = {
        email: "damiancrosa@hotmail.com",
        password: "secreto"
    }

    const cartId= "64e153b02bb0c446de9de2f9";
    const productId= "649e00d8ff57fb9797e876ef";

    it("Logueo de user para acceder al carrito", async()=>{              //testeamos la autorización del endpoint
        const result = await requester.post("/session/login").send(user);
        const cookieResult= result.headers["set-cookie"][0];
        // console.log(cookieResult);
        expect(cookieResult).to.be.ok;
        cookie= {
            name: cookieResult.split("=")[0], //Cookie tiene este formato name=valor
            value: cookieResult.split("=")[1]
        }
        expect(cookie.name).to.be.ok.and.eql(COOKIE_NAME);
        expect(cookie.value).to.be.ok;
    })

    it("GET /api/carts/:cid - Debe traer el carrito por su id", async () => {
        const response= await requester
        .get(`/api/carts/${cartId}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
        expect(response.status).to.equal(200);
    });

    it("POST /api/carts/:cid/product/:pid Debe agregar productos al carrito", async () => {
        const result = await requester
        .post(`/api/carts/${cartId}/product/${productId}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        expect(result.status).to.equal(200)
    })


    it('PUT /api/carts/:cid/product/:pid Debe actualizar la cantidad ', async () => { // Anda OK
        const response = await requester
        .put(`/api/carts/${cartId}/product/${productId}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        .send({
            "quantity": 6
        });
        // console.log(response)
        expect(response.status).to.equal(200);
    });
})