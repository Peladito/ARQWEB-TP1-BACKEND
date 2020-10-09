const {validTrue, validFalse, errored, assertable, responder} = require("../common/entities");
const { GetUserError,UnexistingUserError } = require("../../../../application/getUser/errors");
const getUserUOC = require("../../../../application/getUser");

const actor = {}
describe("getUser uoc cases test", () => {
	test("Happy path", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			checkoutAllowed: validTrue,
			isInfected: validTrue,
			isPossiblyInfected: validTrue
		}
		let uoc = getUserUOC(dependencies)(actor)
		await uoc({})
		
	});
	test("should throw if fetchUser fails", async () => {
		
		let dependencies = {
			fetchUser: errored,
			checkoutAllowed: validTrue,
			isInfected: validTrue,
			isPossiblyInfected: validTrue
		}
		let uoc = getUserUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(GetUserError)
		
	});
	test("should throw if checkoutAllowed fails", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			checkoutAllowed: errored,
			isInfected: validTrue,
			isPossiblyInfected: validTrue
		}
		let uoc = getUserUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(GetUserError)
		
	});
	test("should throw if isInfected fails", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			checkoutAllowed: validTrue,
			isInfected: errored,
			isPossiblyInfected: validTrue
		}
		let uoc = getUserUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(GetUserError)
		
	});
	test("should throw if isPossiblyInfected fails", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			checkoutAllowed: validTrue,
			isInfected: validTrue,
			isPossiblyInfected: errored
		}
		let uoc = getUserUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(GetUserError)
		
	});
})