module.exports = ({createUserUOC, createLocationUOC, getLocationUOC, editLocationUOC}) => ([
    {path:'/user', verb:'POST',uoc:createUserUOC},
    {path:'/location', verb:'POST',uoc:createLocationUOC},
    {path:'/location/:id', verb:'GET',uoc:getLocationUOC},
    {path:'/location/:id', verb:'PUT',uoc:editLocationUOC},
])