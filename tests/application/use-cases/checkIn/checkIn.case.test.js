const {validTrue, validFalse, errored, assertable, responder} = require("../common/entities");
const { CheckInError, CheckinNotAllowedError, UnexistingUserError, UnexistingLocationError} = require("../../../../application/checkIn/errors");
const checkInUOC = require("../../../../application/checkIn");

const actor = {}

describe("checkIn uoc cases test", () => {
	test("Happy path", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			fetchLocation: validTrue,
			checkinAllowed: validTrue,
			checkIn: validTrue
		}
		let uoc = checkInUOC(dependencies)(actor)
		await uoc({})
		
	});
	test("Unexisting user should throw an error", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: validFalse,
			fetchLocation: shouldNotBeUsed,
			checkinAllowed: shouldNotBeUsed,
			checkIn: shouldNotBeUsed
		}
		let uoc = checkInUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(UnexistingUserError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("Error when fetchUser throws", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: errored,
			fetchLocation: shouldNotBeUsed,
			checkinAllowed: shouldNotBeUsed,
			checkIn: shouldNotBeUsed
		}
		let uoc = checkInUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(CheckInError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("Error when location does not exists", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: validTrue,
			fetchLocation: validFalse,
			checkinAllowed: shouldNotBeUsed,
			checkIn: shouldNotBeUsed
		}
		let uoc = checkInUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(UnexistingLocationError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("Error when fetchLocation fails", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: validTrue,
			fetchLocation: errored,
			checkinAllowed: shouldNotBeUsed,
			checkIn: shouldNotBeUsed
		}
		let uoc = checkInUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(CheckInError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("Error when checkinAllowed returns false", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: validTrue,
			fetchLocation: validTrue,
			checkinAllowed: validFalse,
			checkIn: shouldNotBeUsed
		}
		let uoc = checkInUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(CheckinNotAllowedError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("Error when checkinAllowed throws", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: validTrue,
			fetchLocation: validTrue,
			checkinAllowed: errored,
			checkIn: shouldNotBeUsed
		}
		let uoc = checkInUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(CheckInError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("Error when checkIn throws", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			fetchLocation: validTrue,
			checkinAllowed: validTrue,
			checkIn: errored
		}
		let uoc = checkInUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(CheckInError)
		
	});
})