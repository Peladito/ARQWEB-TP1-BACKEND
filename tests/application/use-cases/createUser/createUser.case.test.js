const {validTrue, validFalse, errored, assertable, responder} = require("../common/entities");
const { CreateUserError, UserAlreadyExistsError } = require("../../../../application/use-cases/createUser/errors");
const createUserUOC = require("../../../../application/use-cases/createUser");

const actorDependencies = {getUserAndAppByIdentification: validTrue,can: validTrue}

describe("createUser uoc cases test", () => {
	test("Happy path", async () => {
		
		let dependencies = {
			userExists: validFalse,
			persistUser: validTrue
		}
		Object.assign(dependencies, actorDependencies)
		let uoc = createUserUOC(dependencies)
		await uoc({})
		
	});
	test("User exists", async () => {
		
		let dependencies = {
			userExists: validTrue,
			persistUser: validTrue
		}
		Object.assign(dependencies, actorDependencies)
		let uoc = createUserUOC(dependencies)
		await expect(uoc({})).rejects.toThrow(UserAlreadyExistsError)
		
	});
	test("Error when userExists throws", async () => {
		
		let dependencies = {
			userExists: errored,
			persistUser: validTrue
		}
		Object.assign(dependencies, actorDependencies)
		let uoc = createUserUOC(dependencies)
		await expect(uoc({})).rejects.toThrow(CreateUserError)
		
	});
	test("Error when persistUser throws", async () => {
		
		let dependencies = {
			userExists: validFalse,
			persistUser: errored
		}
		Object.assign(dependencies, actorDependencies)
		let uoc = createUserUOC(dependencies)
		await expect(uoc({})).rejects.toThrow(CreateUserError)
		
	});
})