const {validTrue, validFalse, errored, assertable, responder} = require("../common/entities");
const { ListLocationsError, UnexistingUserError } = require("../../../../application/listLocations/errors");
const listLocationsUOC = require("../../../../application/listLocations");

const actor = {}
describe("listLocations uoc cases test", () => {
	test("Happy path for admin", async () => {
		let shouldNotBeUsed = assertable()
		let shouldBeUsed = assertable()
		let dependencies = {
			fetchUser: validTrue,
			isAdmin: validTrue,
			fetchAllLocations: shouldBeUsed.func,
			fetchOwnedLocations: shouldNotBeUsed.func
		}
		let uoc = listLocationsUOC(dependencies)
		await uoc({})(actor)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		expect(shouldBeUsed.isUsed()).toBe(true)
	});
	test("Happy path for non admin", async () => {
		let shouldNotBeUsed = assertable()
		let shouldBeUsed = assertable()
		let dependencies = {
			fetchUser: validTrue,
			isAdmin: validFalse,
			fetchAllLocations: shouldNotBeUsed.func,
			fetchOwnedLocations: shouldBeUsed.func
		}
		let uoc = listLocationsUOC(dependencies)
		await uoc({})(actor)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		expect(shouldBeUsed.isUsed()).toBe(true)
	});
	test("should throw if the admin check fails", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: validTrue,
			isAdmin: errored,
			fetchAllLocations: shouldNotBeUsed.func,
			fetchOwnedLocations: shouldNotBeUsed.func
		}
		let uoc = listLocationsUOC(dependencies)
		await expect(uoc({})(actor)).rejects.toThrow(ListLocationsError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("should throw if fetchAllLocations fails", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: validTrue,
			isAdmin: validTrue,
			fetchAllLocations: errored,
			fetchOwnedLocations: shouldNotBeUsed.func
		}
		let uoc = listLocationsUOC(dependencies)
		await expect(uoc({})(actor)).rejects.toThrow(ListLocationsError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("should throw if fetchOwnedLocations fails", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: validTrue,
			isAdmin: validFalse,
			fetchAllLocations: shouldNotBeUsed.func,
			fetchOwnedLocations: errored
		}
		let uoc = listLocationsUOC(dependencies)
		await expect(uoc({})(actor)).rejects.toThrow(ListLocationsError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("should throw if fetchUser fails", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: errored,
			isAdmin: shouldNotBeUsed.func,
			fetchAllLocations: shouldNotBeUsed.func,
			fetchOwnedLocations: shouldNotBeUsed.func
		}
		let uoc = listLocationsUOC(dependencies)
		await expect(uoc({})(actor)).rejects.toThrow(ListLocationsError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("should throw if fetchUser returns null", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: validFalse,
			isAdmin: shouldNotBeUsed.func,
			fetchAllLocations: shouldNotBeUsed.func,
			fetchOwnedLocations: shouldNotBeUsed.func
		}
		let uoc = listLocationsUOC(dependencies)
		await expect(uoc({})(actor)).rejects.toThrow(UnexistingUserError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
})