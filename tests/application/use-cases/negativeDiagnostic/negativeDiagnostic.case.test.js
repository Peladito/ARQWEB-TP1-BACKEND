const {validTrue, validFalse, errored, assertable, responder} = require("../common/entities");
const { NegativeDiagnosticError, UnexistingUserError } = require("../../../../application/negativeDiagnostic/errors");
const negativeDiagnosticUOC = require("../../../../application/negativeDiagnostic");

const actor = {}
const date = new Date()
describe("negativeDiagnostic uoc cases test", () => {
	test("Happy path", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			persistDiagnostic: validTrue
		}
		let uoc = negativeDiagnosticUOC(dependencies)(actor)
		await uoc({date})
		
	});
	test("should throw UnexistingUser if user does not exists", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: validFalse,
			persistDiagnostic: shouldNotBeUsed
		}
		let uoc = negativeDiagnosticUOC(dependencies)(actor)
		await expect(uoc({date})).rejects.toThrow(UnexistingUserError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("should throw if fetchUser is errored", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUser: errored,
			persistDiagnostic: shouldNotBeUsed
		}
		let uoc = negativeDiagnosticUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(NegativeDiagnosticError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("should throw if persistDiagnostic is errored", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			persistDiagnostic: errored
		}
		let uoc = negativeDiagnosticUOC(dependencies)(actor)
		await expect(uoc({date})).rejects.toThrow(NegativeDiagnosticError)
		
	});
	test("should throw if parameter is not a timestamp", async () => {
		let shouldNotBeUsed = assertable()
		let dependencies = {
			fetchUser: shouldNotBeUsed.func,
			persistDiagnostic: shouldNotBeUsed.func
		}
		let uoc = negativeDiagnosticUOC(dependencies)(actor)
		await expect(uoc({date:'nana'})).rejects.toThrow(NegativeDiagnosticError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
})