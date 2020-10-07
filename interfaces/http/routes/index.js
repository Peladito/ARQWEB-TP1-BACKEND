module.exports = ({createUserUOC, createLocationUOC}) => ([
    {path:'/user', verb:'POST',uoc:createUserUOC},
    {path:'/location', verb:'POST',uoc:createLocationUOC},
])