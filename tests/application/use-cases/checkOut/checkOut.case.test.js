const {validTrue, validFalse, errored, assertable, responder} = require("../common/entities");
const { CheckOutError, CheckOutNotAllowedError, UnexistingUserError } = require("../../../../application/checkOut/errors");
const checkOutUOC = require("../../../../application/checkOut");

const actor = {}
describe("checkOut uoc cases test", () => {
	test("Happy path", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			checkoutAllowed: validTrue,
			checkout: validTrue
		}
		let uoc = checkOutUOC(dependencies)(actor)
		await uoc({})
		
	});
	test("Unexisting user should throw an error", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: validFalse,
			checkoutAllowed: shouldNotBeUsed,
			checkout: shouldNotBeUsed
		}
		let uoc = checkOutUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(UnexistingUserError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("Error when fetchUser throws", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: errored,
			checkoutAllowed: shouldNotBeUsed,
			checkout: shouldNotBeUsed
		}
		let uoc = checkOutUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(CheckOutError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("Error when checkoutAllowed returns false", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: validTrue,
			checkoutAllowed: validFalse,
			checkout: shouldNotBeUsed
		}
		let uoc = checkOutUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(CheckOutNotAllowedError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("Error when checkoutAllowed throws", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: validTrue,
			checkoutAllowed: errored,
			checkout: shouldNotBeUsed
		}
		let uoc = checkOutUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(CheckOutError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("Error when checkout throws", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			checkoutAllowed: validTrue,
			checkout: errored
		}
		let uoc = checkOutUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(CheckOutError)
		
	});
})