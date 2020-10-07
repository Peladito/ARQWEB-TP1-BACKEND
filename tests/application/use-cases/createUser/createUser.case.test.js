const {validTrue, validFalse, errored, assertable, responder} = require("../common/entities");
const { CreateUserError, UserAlreadyExistsError } = require("../../../../application/createUser/errors");
const createUserUOC = require("../../../../application/createUser");


describe("createUser uoc cases test", () => {
	test("Happy path", async () => {
		
		let dependencies = {
			userExists: validFalse,
			persistUser: validTrue
		}
		let uoc = createUserUOC(dependencies)
		await uoc({})
		
	});
	test("User exists", async () => {
		
		let dependencies = {
			userExists: validTrue,
			persistUser: validTrue
		}
		let uoc = createUserUOC(dependencies)
		await expect(uoc({})).rejects.toThrow(UserAlreadyExistsError)
		
	});
	test("Error when userExists throws", async () => {
		
		let dependencies = {
			userExists: errored,
			persistUser: validTrue
		}
		let uoc = createUserUOC(dependencies)
		await expect(uoc({})).rejects.toThrow(CreateUserError)
		
	});
	test("Error when persistUser throws", async () => {
		
		let dependencies = {
			userExists: validFalse,
			persistUser: errored
		}
		let uoc = createUserUOC(dependencies)
		await expect(uoc({})).rejects.toThrow(CreateUserError)
		
	});
})