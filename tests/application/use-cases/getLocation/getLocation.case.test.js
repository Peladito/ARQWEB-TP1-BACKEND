const {validTrue, validFalse, errored, assertable, responder} = require("../common/entities");
const { GetLocationError, UnexistingLocationError } = require("../../../../application/getLocation/errors");
const getLocationUOC = require("../../../../application/getLocation");



describe("getLocation uoc cases test", () => {
	test("Happy path", async () => {
		
		let dependencies = {
			fetchLocation: validTrue
		}
		let uoc = getLocationUOC(dependencies)
		await uoc({})
		
	});
	test("Location does not exists", async () => {
		
		let dependencies = {
			fetchLocation: validFalse
		}
		let uoc = getLocationUOC(dependencies)()
		await expect(uoc({id:1})).rejects.toThrow(UnexistingLocationError)
		
	});
	test("Error when fetchLocation throws", async () => {
		
		let dependencies = {
			fetchLocation: errored
		}
		let uoc = getLocationUOC(dependencies)()
		await expect(uoc({})).rejects.toThrow(GetLocationError)
		
	});
})