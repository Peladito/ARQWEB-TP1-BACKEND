const cron = require("node-cron");

logger = f => async () => {
    console.log('cron task summoned')
    try {
        await f({})
    } catch (error) {
        console.error(error)
    }
}


module.exports =  {
    
        run : activities => {activities.forEach(({activity, timelaps}) => cron.schedule(timelaps, logger(activity)));console.log("cron started")},
        timelaps:{
            everyHour : "0 * * * *",
            everyMinute : "* * * * *",
            everyThirtySeconds : "*/30 * * * * *"
        }
    
} 