module.exports = ({createUserUOC, createLocationUOC, getLocationUOC, editLocationUOC, checkInUOC, checkOutUOC, positiveDiagnosticUOC, negativeDiagnosticUOC, getUserUOC, listLocationsUOC, getStatisticsUOC, getConfigurationsUOC,editConfigurationUOC}) => ([
    {path:'/user', verb:'POST',uoc:createUserUOC},
    {path:'/user', verb:'GET',uoc:getUserUOC},
    {path:'/user/checkin/:id', verb:'POST',uoc:checkInUOC},
    {path:'/user/checkout', verb:'POST',uoc:checkOutUOC},
    {path:'/user/diagnostic/:date', verb:'POST',uoc:positiveDiagnosticUOC},
    {path:'/user/diagnostic/:date', verb:'DELETE',uoc:negativeDiagnosticUOC},
    {path:'/location', verb:'POST',uoc:createLocationUOC},
    {path:'/location', verb:'GET',uoc:listLocationsUOC},
    {path:'/location/:id', verb:'GET',uoc:getLocationUOC},
    {path:'/location/:id', verb:'PUT',uoc:editLocationUOC},
    {path:'/statistics', verb:'GET',uoc:getStatisticsUOC},
    {path:'/configurations', verb:'GET',uoc:getConfigurationsUOC},
    {path:'/configurations', verb:'PUT',uoc:editConfigurationUOC},
    
])