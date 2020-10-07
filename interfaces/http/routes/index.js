module.exports = ({createUserUOC, createLocationUOC, getLocationUOC, editLocationUOC, checkInUOC, checkOutUOC, positiveDiagnosticUOC}) => ([
    {path:'/user', verb:'POST',uoc:createUserUOC},
    {path:'/user/checkin/:id', verb:'POST',uoc:checkInUOC},
    {path:'/user/checkout', verb:'POST',uoc:checkOutUOC},
    {path:'/user/diagnostic', verb:'POST',uoc:positiveDiagnosticUOC},
    {path:'/location', verb:'POST',uoc:createLocationUOC},
    {path:'/location/:id', verb:'GET',uoc:getLocationUOC},
    {path:'/location/:id', verb:'PUT',uoc:editLocationUOC},
    
])