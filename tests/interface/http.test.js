const config = require('../../config/config')
const dataAccess = require('../../data-access')(config)
const uoc = require('../../application')(dataAccess)
const httpInterface = require('../../interfaces/http')(uoc, {port:3000})

const supertest = require('supertest')
const request = supertest(httpInterface)
describe("HTTP interface", () => {
    beforeAll(async ()=>{
        await dataAccess.deleteAll()
    })
    test("POST /users should allow to create an user", async () => {
        
        const res = await request.post('/user').send({email:'jhon@salchichon.com'})
        expect(res.status).toBe(200)
    })
 
});