const { SendNotificationsError } = require("./errors");

exports.sendNotifications = ({fetchUnsentNotifications, sendNotifications}) => actor => async ({}) => {
    try{
        let notifications = await fetchUnsentNotifications({})
        console.log(notifications)
        await sendNotifications(notifications)
    }catch(error){
        throw new SendNotificationsError(error)
    }
    
}