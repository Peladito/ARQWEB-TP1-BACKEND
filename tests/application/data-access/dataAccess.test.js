require('dotenv').config()
require('mongoose');
const config = require('../../../config')
const {persistUser, userExists, deleteAll} = require('../../../data-access')(config)


describe("Data access", () => {
    const user = {
        email: 'fake@mail.com'
    }
    beforeAll(async () => {
        await deleteAll()
    })
	test("should allow to persist an user", async () => {
		
        await persistUser(user)
		
	});
	test("should say if an user exists", async () => {
		
        let res = await userExists(user)
        let res2 = await userExists({email:'unexistingemail'})
        expect(res).toBe(true)
        expect(res2).toBe(false)
		
	});
	
})