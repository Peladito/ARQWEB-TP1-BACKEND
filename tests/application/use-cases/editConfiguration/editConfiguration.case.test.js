const {validTrue, validFalse, errored, assertable, responder} = require("../common/entities");
const { EditConfigurationError, UnauthorizedUserError, UnexistingUserError } = require("../../../../application/editConfiguration/errors");
const editConfigurationUOC = require("../../../../application/editConfiguration");


const actor = {}
describe("editConfiguration uoc cases test", () => {
	test("Happy path", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			isAdmin: validTrue,
			persistConfigurations: validTrue
		}
		let uoc = editConfigurationUOC(dependencies)(actor)
		await uoc({})
		
	});
	test("should throw if fetchUser fails", async () => {
		
		let dependencies = {
			fetchUser: errored,
			isAdmin: validTrue,
			persistConfigurations: validTrue
		}
		let uoc = editConfigurationUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(EditConfigurationError)
		
	});
	test("should throw if isAdmin fails", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			isAdmin: errored,
			persistConfigurations: validTrue
		}
		let uoc = editConfigurationUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(EditConfigurationError)
		
	});
	test("should throw if isAdmin returns false", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			isAdmin: validFalse,
			persistConfigurations: validTrue
		}
		let uoc = editConfigurationUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(UnauthorizedUserError)
		
	});
	test("should throw if persistConfigurations throws", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			isAdmin: validTrue,
			persistConfigurations: errored
		}
		let uoc = editConfigurationUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(EditConfigurationError)
		
	});
})