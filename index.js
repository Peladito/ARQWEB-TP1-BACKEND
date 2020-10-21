const config = require('./config')
const dataAccess = require('./data-access')(config)
const uoc = require('./application')(dataAccess)
const httpInterface = require('./interfaces/http')(uoc, {port:config.http.port})
const cronInterface = require('./interfaces/cron')
cronInterface.run(([
    {
        activity:uoc.sendNotificationsUOC,
        timelaps:cronInterface.timelaps.everyThirtySeconds
    }
]))