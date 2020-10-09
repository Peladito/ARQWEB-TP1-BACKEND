const {validTrue, validFalse, errored, assertable, responder} = require("../common/entities");
const { GetConfigurationsError, UnauthorizedUserError } = require("../../../../application/getConfigurations/errors");
const getConfigurationsUOC = require("../../../../application/getConfigurations");

const actor = {}
describe("getConfigurations uoc cases test", () => {
	test("Happy path", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			isAdmin: validTrue,
			fetchConfigurations: validTrue
		}
		let uoc = getConfigurationsUOC(dependencies)(actor)
		await uoc({})
		
	});
	test("should throw if fetchUser fails", async () => {
		
		let dependencies = {
			fetchUser: errored,
			isAdmin: validTrue,
			fetchConfigurations: validTrue
		}
		let uoc = getConfigurationsUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(GetConfigurationsError)
		
	});
	test("should throw if isAdmin fails", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			isAdmin: errored,
			fetchConfigurations: validTrue
		}
		let uoc = getConfigurationsUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(GetConfigurationsError)
		
	});
	test("should throw if isAdmin returns false", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			isAdmin: validFalse,
			fetchConfigurations: validTrue
		}
		let uoc = getConfigurationsUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(UnauthorizedUserError)
		
	});
	test("should throw if fetchConfigurations throws", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			isAdmin: validTrue,
			fetchConfigurations: errored
		}
		let uoc = getConfigurationsUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(GetConfigurationsError)
		
	});
})