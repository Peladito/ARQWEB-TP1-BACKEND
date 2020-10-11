const {validTrue, validFalse, errored, assertable, responder} = require("../common/entities");
const { SendNotificationsError } = require("../../../../application/use-cases/sendNotifications/errors");
const sendNotificationsUOC = require("../../../../application/use-cases/sendNotifications");

//Actor dependencies: this code does not need to be considered in the tests (asume the correct actor access the uoc)
const actorDependencies = {getUserAndAppByIdentification: validTrue,can: validTrue}

describe("sendNotifications uoc test", () => {
    test("should be implemented", async () => {
        let dependencies = {
            //complete with uoc dependencies
        }
        Object.assign(dependencies,actorDependencies)
        let uoc = sendNotificationsUOC(dependencies)
        await uoc({/*complete with uoc parameters*/})
        
    });
    
})