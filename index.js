const config = require('./config')
const dataAccess = require('./data-access')(config)
const uoc = require('./application')(dataAccess)
const httpInterface = require('./interfaces/http')(uoc, {port:3000})
const cronInterface = require('./interfaces/cron')
cronInterface.run(([
    {
        activity:uoc.sendNotificationsUOC,
        timelaps:cronInterface.timelaps.everyThirtySeconds
    }
]))