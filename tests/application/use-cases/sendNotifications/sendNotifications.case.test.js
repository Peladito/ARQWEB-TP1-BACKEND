const {validTrue, validFalse, errored, assertable, responder} = require("../common/entities");
const { SendNotificationsError } = require("../../../../application/sendNotifications/errors");
const sendNotificationsUOC = require("../../../../application/sendNotifications");

const actor = {}

describe("sendNotifications uoc cases test", () => {
	test("Happy path", async () => {
		
		let dependencies = {
			fetchUnsentNotifications: validTrue,
			sendNotifications: validTrue
		}
		let uoc = sendNotificationsUOC(dependencies)(actor)
		await uoc({})
		
	});
	test("should throw fetchUnsentNotifications fails", async () => {
		let shouldNotBeUsed = assertable()
		
		let dependencies = {
			fetchUnsentNotifications: errored,
			sendNotifications: shouldNotBeUsed
		}
		let uoc = sendNotificationsUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(SendNotificationsError)
		expect(shouldNotBeUsed.isUsed()).toBe(false)
		
	});
	test("should throw sendNotifications fails", async () => {
		
		let dependencies = {
			fetchUnsentNotifications: validTrue,
			sendNotifications: errored
		}
		let uoc = sendNotificationsUOC(dependencies)(actor)
		await expect(uoc({})).rejects.toThrow(SendNotificationsError)
		
	});
})