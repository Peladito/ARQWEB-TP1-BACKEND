const {validTrue, validFalse, errored, assertable, responder} = require("../common/entities");
const { GetStatisticsError, UnauthorizedUserError } = require("../../../../application/getStatistics/errors");
const getStatisticsUOC = require("../../../../application/getStatistics");
const actor = {}
const actorDependencies = {getUserAndAppByIdentification: validTrue,can: validTrue}

describe("getStatistics uoc cases test", () => {
	test("Happy path", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			isAdmin: validTrue,
			locationsCount: validTrue,
			usersCount: validTrue,
			infectedCount: validTrue,
			possibleContagionCount: validTrue
		}
		
		let uoc = getStatisticsUOC(dependencies)(actor)
		await uoc({})
		
	});
	test("should not allow non admin to fetch the statistics", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			isAdmin: validFalse,
			locationsCount: validTrue,
			usersCount: validTrue,
			infectedCount: validTrue,
			possibleContagionCount: validTrue
		}
		
		let uoc = getStatisticsUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(UnauthorizedUserError)
		
	});
	test("should throw if fetchUser fails", async () => {
		
		let dependencies = {
			fetchUser: errored,
			isAdmin: validTrue,
			locationsCount: validTrue,
			usersCount: validTrue,
			infectedCount: validTrue,
			possibleContagionCount: validTrue
		}
		
		let uoc = getStatisticsUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(GetStatisticsError)
		
	});
	test("should throw if isAdmin fails", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			isAdmin: errored,
			locationsCount: validTrue,
			usersCount: validTrue,
			infectedCount: validTrue,
			possibleContagionCount: validTrue
		}
		
		let uoc = getStatisticsUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(GetStatisticsError)
		
	});
	test("should throw if locationsCount fails", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			isAdmin: validTrue,
			locationsCount: errored,
			usersCount: validTrue,
			infectedCount: validTrue,
			possibleContagionCount: validTrue
		}
		
		let uoc = getStatisticsUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(GetStatisticsError)
		
	});
	test("should throw if usersCount fails", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			isAdmin: validTrue,
			locationsCount: validTrue,
			usersCount: errored,
			infectedCount: validTrue,
			possibleContagionCount: validTrue
		}
		
		let uoc = getStatisticsUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(GetStatisticsError)
		
	});
	test("should throw if infectedCount fails", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			isAdmin: validTrue,
			locationsCount: validTrue,
			usersCount: validTrue,
			infectedCount: errored,
			possibleContagionCount: validTrue
		}
		
		let uoc = getStatisticsUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(GetStatisticsError)
		
	});
	test("should throw if possibleContagionCount fails", async () => {
		
		let dependencies = {
			fetchUser: validTrue,
			isAdmin: validTrue,
			locationsCount: validTrue,
			usersCount: validTrue,
			infectedCount: validTrue,
			possibleContagionCount: errored
		}
		
		let uoc = getStatisticsUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(GetStatisticsError)
		
	});
})