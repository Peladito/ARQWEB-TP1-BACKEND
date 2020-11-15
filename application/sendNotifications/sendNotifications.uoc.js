const { SendNotificationsError } = require("./errors");

exports.sendNotifications = ({fetchUnsentNotifications, sendNotifications}) => async ({}) => {
    try{
        let notifications = await fetchUnsentNotifications({})
        console.log("Notifications to send:",notifications)
        await sendNotifications(notifications)
    }catch(error){
        throw new SendNotificationsError(error)
    }
    
}