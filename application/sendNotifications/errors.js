class SendNotificationsError extends Error {
                        constructor(details, ...args) {
                            super(...args)
                            this.code = "OBJ001"
                            this.message = "SendNotifications error"
                            this.details = details
                            Error.captureStackTrace(this, SendNotificationsError)
                        }
                    }
                    
                    module.exports = {SendNotificationsError}