import chai from "chai";
import supertest from "supertest";
import config from "../config/config.js";
import { faker } from "@faker-js/faker";


const PORT = config.port;
const COOKIE_NAME = config.cookieNameJWT;

const expect = chai.expect;
const requester = supertest(`http://localhost:${PORT}`);

describe("Testing Ecommers de session - Ruta /api/session", () => {
    const newUser = {
        first_name: faker.internet.userName(),
        last_name: faker.internet.userName(),
        email: faker.internet.email(),
        age: 30,
        role: 'user',
        password: 'secret',
        cart: null,
    };

    it("REGISTER USER", async function () { //no puede ser function flecha porque tiene un this 
        this.timeout(7000);
        const response = await requester
            .post("/session/register")
            .send(newUser);
        expect(response.status).to.equal(302); //302 porque redirecciona a login
    })


    it('LOGIN DE USER Y DEVUELVE UNA COOKIE', async () => { // Anda OK
        const response = await requester
            .post('/session/login')
            .send({
                email: newUser.email,
                password: newUser.password
            });
        const cookieResult = response.headers['set-cookie'][0]; //extraigo cookie que se genera en login
        expect(cookieResult).to.be.ok;
        expect(cookieResult.split('=')[0]).to.be.eql(COOKIE_NAME);
        expect(cookieResult.split('=')[1]).to.be.ok;
    });
})