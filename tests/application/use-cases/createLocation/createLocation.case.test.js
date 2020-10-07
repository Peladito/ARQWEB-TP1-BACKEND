const {validTrue, validFalse, errored, assertable, responder} = require("../common/entities");
const { CreateLocationError, LocationAlreadyExistsError, UnexistingUserError } = require("../../../../application/createLocation/errors");
const createLocationUOC = require("../../../../application/createLocation");
const actor = {email:'default@actor.com'}

describe("createLocation uoc cases test", () => {
		test("Happy path", async () => {
		
		let dependencies = {
						fetchUser: validTrue,
						locationExists: validFalse,
						persistLocation: validTrue
		}
		let uoc = createLocationUOC(dependencies)(actor)
		await uoc({})
		
	});
	test("Location exists", async () => {
		
		let dependencies = {
						fetchUser: validTrue,
						locationExists: validTrue,
						persistLocation: validTrue
		}
		let uoc = createLocationUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(LocationAlreadyExistsError)
		
	});
	test("Error when locationExists throws", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
						fetchUser: validTrue,
						locationExists: errored,
						persistLocation: shouldNotBeUsed
		}
		let uoc = createLocationUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(CreateLocationError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("Error when persistLocation throws", async () => {
		
		let dependencies = {
						fetchUser: validTrue,
						locationExists: validFalse,
						persistLocation: errored
		}
		let uoc = createLocationUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(CreateLocationError)
		
	});
	test("Error when fetchUser throws", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
						fetchUser: errored,
						locationExists: validFalse,
						persistLocation: shouldNotBeUsed
		}
		let uoc = createLocationUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(CreateLocationError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("Error when the user does not exists", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
						fetchUser: validFalse,
						locationExists: shouldNotBeUsed,
						persistLocation: shouldNotBeUsed
		}
		let uoc = createLocationUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(UnexistingUserError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
})