const {validTrue, validFalse, errored, assertable, responder} = require("../common/entities");
const { EditLocationError, UnauthorizedUserError, UnexistingLocationError, UnexistingUserError } = require("../../../../application/editLocation/errors");
const editLocationUOC = require("../../../../application/editLocation");

const actor = {}
describe("editLocation uoc cases test", () => {
	test("Happy path", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			fetchLocation: validTrue,
			isLocationOwner: validTrue,
			updateLocation: validTrue
		}
		let uoc = editLocationUOC(dependencies)(actor)
		await uoc({})
		
	});
	test("Actor is not the owner", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: validTrue,
			fetchLocation: validTrue,
			isLocationOwner: validFalse,
			updateLocation: shouldNotBeUsed
		}
		let uoc = editLocationUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(UnauthorizedUserError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("Error when isLocationOwner throws", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: validTrue,
			fetchLocation: validTrue,
			isLocationOwner: errored,
			updateLocation: shouldNotBeUsed
		}
		let uoc = editLocationUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(EditLocationError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("Error when updateLocation throws", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			fetchLocation: validTrue,
			isLocationOwner: validTrue,
			updateLocation: errored
		}
		let uoc = editLocationUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(EditLocationError)
		
	});
	test("Error when fetchLocation throws", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: validTrue,
			fetchLocation: errored,
			isLocationOwner: shouldNotBeUsed,
			updateLocation: shouldNotBeUsed
		}
		let uoc = editLocationUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(EditLocationError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("Error when fetchLocation return null", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: validTrue,
			fetchLocation: validFalse,
			isLocationOwner: shouldNotBeUsed,
			updateLocation: shouldNotBeUsed
		}
		let uoc = editLocationUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(UnexistingLocationError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("Error when fetchUser return null", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: validFalse,
			fetchLocation: validTrue,
			isLocationOwner: shouldNotBeUsed,
			updateLocation: shouldNotBeUsed
		}
		let uoc = editLocationUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(UnexistingUserError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("Error when fetchUser throws", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: errored,
			fetchLocation: validTrue,
			isLocationOwner: shouldNotBeUsed,
			updateLocation: shouldNotBeUsed
		}
		let uoc = editLocationUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(EditLocationError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
})