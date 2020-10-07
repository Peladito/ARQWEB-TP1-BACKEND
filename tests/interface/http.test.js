const config = require('../../config')
const dataAccess = require('../../data-access')(config)
const uoc = require('../../application')(dataAccess)
const httpInterface = require('../../interfaces/http')(uoc, {port:3000})

const supertest = require('supertest')
const request = supertest(httpInterface)
describe("HTTP interface", () => {
    beforeEach(async ()=>{
        await dataAccess.deleteAll()
    })
    test("POST /users should allow to create an user", async () => {
        
        const res = await request.post('/user').send({email:'jhon@salchichon.com'})
        expect(res.status).toBe(200)
    })

    
    test("POST /users should throw 409 if user already exists", async () => {
        
        await request.post('/user').send({email:'jhon@salchichon.com'})
        const res = await request.post('/user').send({email:'jhon@salchichon.com'})
        expect(res.status).toBe(409)
    })

    test("POST /location should allow to create a location ", async () => {
        await request.post('/user').send({email:'jhon@salchichon.com'})
        const location = {
                "name": "test",
                "description": "a comon test",
                "maxCapacity": 10,
                "address": "fakestreet 1234",
                "latitude": 23.022552,
                "longitude": 56.3658
        }
        const res = await request.post('/location').auth('jhon@salchichon.com','').send(location)
        expect(res.status).toBe(200)
    })
 
});