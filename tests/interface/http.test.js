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
    test("POST /location should throw 409 if the location already exists", async () => {
        await request.post('/user').send({email:'jhon@salchichon.com'})
        const location = {
                "name": "test",
                "description": "a comon test",
                "maxCapacity": 10,
                "address": "fakestreet 1234",
                "latitude": 23.022552,
                "longitude": 56.3658
        }
        await request.post('/location').auth('jhon@salchichon.com','').send(location)
        const res = await request.post('/location').auth('jhon@salchichon.com','').send(location)
        expect(res.status).toBe(409)
    })
    test("POST /location should throw 403 if the actor does not exists", async () => {
        const location = {
                "name": "test",
                "description": "a comon test",
                "maxCapacity": 10,
                "address": "fakestreet 1234",
                "latitude": 23.022552,
                "longitude": 56.3658
        }
        const res = await request.post('/location').auth('jhon@salchichon.com','').send(location)
        expect(res.status).toBe(403)
    })
    test("GET /location/:id should return a location by its id", async () => {
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
        const res2 = await request.get('/location/'+res.body.id).auth('jhon@salchichon.com','')
        expect(res.body.id).toBe(res2.body.id)
    })

    test("PUT /location/:id should return404 if the location does not exists", async () => {
        await request.post('/user').send({email:'jhon@salchichon.com'})
        let location = {
                "name": "test",
                "description": "a comon test",
                "maxCapacity": 10,
                "address": "fakestreet 1234",
                "latitude": 23.022552,
                "longitude": 56.3658
        }
        const res = await request.put('/location/5f7e24a92cf4418988523fef').auth('jhon@salchichon.com','').send(location)

        expect(res.status).toBe(404)

    })
    test("POST /user/checkin/:id should return ok", async () => {
        await request.post('/user').send({email:'jhon@salchichon.com'})
        let location = {
                "name": "test",
                "description": "a comon test",
                "maxCapacity": 10,
                "address": "fakestreet 1234",
                "latitude": 23.022552,
                "longitude": 56.3658
        }
        const res = await request.post('/location').auth('jhon@salchichon.com','').send(location)
        location.description = "different description"
        const res2 = await request.post('/user/checkin/'+res.body.id).auth('jhon@salchichon.com','')
        expect(res2.status).toBe(200)
    })
    test("POST /user/checkout should return ok", async () => {
        await request.post('/user').send({email:'jhon@salchichon.com'})
        let location = {
                "name": "test",
                "description": "a comon test",
                "maxCapacity": 10,
                "address": "fakestreet 1234",
                "latitude": 23.022552,
                "longitude": 56.3658
        }
        const res = await request.post('/location').auth('jhon@salchichon.com','').send(location)
        await request.post('/user/checkin/'+res.body.id).auth('jhon@salchichon.com','')
        const res2 = await request.post('/user/checkout').auth('jhon@salchichon.com','')
        expect(res2.status).toBe(200)
    })
    test("POST /user/checkout should return 409 if it was not made a previous checkin", async () => {
        await request.post('/user').send({email:'jhon@salchichon.com'})
        let location = {
                "name": "test",
                "description": "a comon test",
                "maxCapacity": 10,
                "address": "fakestreet 1234",
                "latitude": 23.022552,
                "longitude": 56.3658
        }
        const res = await request.post('/location').auth('jhon@salchichon.com','').send(location)
        location.description = "different description"
        const res2 = await request.post('/user/checkout').auth('jhon@salchichon.com','')
        expect(res2.status).toBe(409)
    })
    test("POST /user/diagnostic should return ok ", async () => {
        await request.post('/user').send({email:'jhon@salchichon.com'})
        
        const res2 = await request.post('/user/diagnostic').auth('jhon@salchichon.com','')
        expect(res2.status).toBe(200)
    })
});