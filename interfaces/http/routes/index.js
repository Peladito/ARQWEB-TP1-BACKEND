module.exports = ({createUserUOC, createLocationUOC, getLocationUOC}) => ([
    {path:'/user', verb:'POST',uoc:createUserUOC},
    {path:'/location', verb:'POST',uoc:createLocationUOC},
    {path:'/location/:id', verb:'GET',uoc:getLocationUOC},
])