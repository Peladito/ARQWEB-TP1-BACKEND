
const fetchConfigurations = ({configurationModel}) => async ({}) => {
   let c =await configurationModel.findOne({name:'main'})
   if(!c) {
      c = new configurationModel({name:'main', daysToBeCured:15, minutesForContagionByContact:30})
      await c.save()
   }
   return c
}
const persistConfigurations = ({configurationModel}) => async (configuration) => {
   return configurationModel.findOneAndUpdate({name:'main'},{$set:configuration},{upsert: true})
}
const curedTimespan = async () => ndaysBefore(15)
const minutesForContagionByContact = () => 30
const userExists = ({userModel}) => async ({email}) => {
   let count = await userModel.countDocuments({email})
   return count > 0
}
const persistUser = ({userModel}) => async ({email, isAdmin=false}) => {
   let u = new userModel({email, isAdmin})
   await u.save()
   return u
}
const locationExists = ({locationModel}) => async ({name}) => {
   let count = await locationModel.countDocuments({name})
   return count > 0
}
const persistLocation = ({locationModel}) => async ({maxCapacity, name, description, latitude, longitude, address, owner, images}) => {
   let l = new locationModel({maxCapacity, name, description, latitude, longitude, address, owner, images})
   l.position.coordinates =  [longitude, latitude]
   await l.save()
   return l
}
const fetchUser = ({userModel}) => async ({email}) => {
   return await userModel.findOne({email})
   
}
const deleteAll = ({userModel, locationModel, checksModel, diagnosticModel, configurationModel}) => async () => {
   await userModel.deleteMany({})
   await locationModel.deleteMany({})
   await checksModel.deleteMany({})
   await diagnosticModel.deleteMany({})
   await configurationModel.deleteMany({})
   return true
}

const fetchLocation = ({locationModel}) => async (location) => {
   if(location.id){
      location._id = location.id
      delete location.id
   }
   return await locationModel.findOne(location)
}
const updateLocation = ({locationModel}) => async ({location, locationData}) => {
   delete locationData._id
   Object.assign(location, locationData)
   return await locationModel.updateOne({_id:location.id},{$set:location})
}
const isLocationOwner = ({}) => async ({location, user}) => {
   return location.owner.toString() === user.id
}
const checkIn = ({checksModel}) => async ({location, user, checkin}) => {
   checkin = checkin?checkin:new Date()
   let c = new checksModel({location, user, checkin})
   await c.save()
   return c
}
const checkinAllowed = ({checksModel}) => async ({user}) => {
   return 0 === await checksModel.countDocuments({user: user.id, checkout: null})
}
const checkoutAllowed = ({checksModel}) => async ({user}) => {
   return 0 < await checksModel.countDocuments({user: user.id, checkout: null})
}
const checkout = ({checksModel}) => async (o, date = new Date) => {
   let check = await checksModel.findOne({user: o.id, checkout: null})
   check.checkout = date
   await check.save()
}
const persistDiagnostic = ({diagnosticModel, checksModel}) => async ({user, status, date}) => {
   date = date?date:new Date()
   let c = new diagnosticModel({user,status, date})
   await c.save()
   let minContactoEstrechoParaContagio = await minutesForContagionByContact()
   let milisegsMinimos = 1000 * 60 * minContactoEstrechoParaContagio
   if(status === 'positive'){
      let placesWhereUserAttended = await checksModel.find({user: user.id, createdAt: {$gt: ndaysBefore(15)}})
      //agrego checkout a las fechas que no esten finalizadas
      const moreThanMinimumContagionTime = p=> !p.checkout ||  (p.checkout && p.checkout.getTime()-p.checkin.getTime() > milisegsMinimos)
      let promises = placesWhereUserAttended.filter(moreThanMinimumContagionTime ).map(async place =>{
         
         let coc = place.checkout?place.checkout:null
         let cic = place.checkin
         //si el checkout contagion es nulo (no se hizo coc == false) entonces no preguntamos por el
         //las entradas que no tengan  checkout se contemplan
         let firstCond = {checkin:{$lte:cic}, checkout:{$gte:cic}}
         let secondCond = coc?{checkin:{$lte:coc}, checkout:{$gte:cic}} : {checkout:{$gte:cic}}
         let thirdCond = coc? {checkin:{$lte:cic}, checkout:{$gte:coc}} : {checkin:{$lte:cic}}
         let forthCond = coc? {checkin:{$gte:cic}, checkout:{$lte:coc}} : {checkin:{$gte:cic}}
         
         let first_nocheckout = {checkin:{$lte:cic}, checkout:null}
         let third_nocheckout ={checkin:{$lte:cic}, checkout:null}
         let forth_nocheckout ={checkin:{$gte:cic}, checkout:null}
         let $or = [firstCond,secondCond,thirdCond,forthCond,first_nocheckout,third_nocheckout,forth_nocheckout]
         //Descartar todos aquellos intervalos que son menores a 30 minutos (ups! :P)

         let milisec = minContactoEstrechoParaContagio * 60 * 1000
         return await checksModel.updateMany({location:place.location, $or,  $expr: { $gt: [ {$subtract: [ {$ifNull:["$checkout",new Date()]},"$checkin"]} , milisec ] }  },{$set:{possibleInfection: true}})
      })
      await Promise.all(promises)
   }
   
}
function nMinutesBefore(date, minutes){
   return new Date(date.getTime()  - 1000 * 60 * minutes)
   
}
function ndaysBefore(ndays, date=new Date()){
   let timespan = date
   timespan.setDate(timespan.getDate() - ndays);
   return timespan
}
const isInfected = ({diagnosticModel}) => async ({user}) => {
   let lastDiagnostic = await diagnosticModel.findOne({user:user.id, date:{$gt:await curedTimespan()}}, null, {limit:1, sort: { _id : 'desc' }})
   return lastDiagnostic!==null && lastDiagnostic.status ==='positive'
}

const isPossiblyInfected = ({checksModel, diagnosticModel}) => async ({user}) => {
   let cTimeSpan = await curedTimespan()
   let lastDiagnostic = await diagnosticModel.findOne({user:user.id, date:{$gt:cTimeSpan}}, null, {limit:1, sort: { _id : 'desc' }})
   if(lastDiagnostic && lastDiagnostic.status ==='positive') return true
   
   let curedDate = lastDiagnostic && lastDiagnostic.date > cTimeSpan?lastDiagnostic.date:cTimeSpan
   return 0 < await checksModel.count({user: user.id, possibleInfection:true, checkin:{$gt:curedDate}})
}

const isAdmin = ({})=>({user})=>{
   return user.isAdmin === true
}

const fetchAllLocations = ({locationModel, checksModel}) => async ({user}) => {
   
   let owner = user?{owner:user}:{}
   let locations = await locationModel.find(owner)
   let checks = await checksModel.find({checkout:{$exists:false},location:{$in:locations.map(l=>l._id)}})
   return locations.map(l=>{
      let loc = l.toObject()
      return {...loc, occupation:checks.filter(c=>c.location.toString() === l.id).length}
   })
}
const fetchOwnedLocations = (dependencies) => ({user}) => {
   return fetchAllLocations(dependencies)({user})
}
const usersCount = ({userModel}) => ({}) => {
   return userModel.count({})
}
const locationsCount = ({locationModel}) => ({}) => {
   return locationModel.count({})
}
const infectedCount = ({diagnosticModel}) => async ({}) => {
   let count = await diagnosticModel.aggregate([
      {$match:{date:{$gt:await curedTimespan()}}},
      {
        $sort:{ _id:-1 }
      },
      {
        $group: {
          _id: { user : "$user" },
          status: { $first : "$status" }
        }
      },
      {$match:{status:'positive'}},
      {
          $count: "infections"
      }
    ])
    return count.length?count[0].infections:0
}

const possibleContagionCount = ({checksModel}) => async ({}) => {
   return await checksModel.count({possibleInfection:true, checkin:{$gt:await curedTimespan()}})
}

const fetchUnsentNotifications = ({checksModel}) => async ({}) => {
   let curedTimespanVal = await curedTimespan()
   let res = await checksModel.find({checkin:{$gt:curedTimespanVal}, possibleInfection:true, notified:false}).populate('user')
   return res
}
const sendNotifications = ({checksModel, notificationService}) => async (notifications=[]) => {
   let recipients = notifications.map(n=>n.user.email)
   await notificationService.sendWarningMail(recipients)
   let res = await checksModel.updateMany({_id:{$in:notifications.map(r=>r._id)}},{$set:{notified:true}})
   return res
}
module.exports = (dependencies) => {
   return {
      userExists: userExists(dependencies),
      fetchUser: fetchUser(dependencies),
      persistUser: persistUser(dependencies),
      deleteAll: deleteAll(dependencies),
      locationExists: locationExists(dependencies),
      persistLocation: persistLocation(dependencies),
      fetchLocation: fetchLocation(dependencies),
      updateLocation: updateLocation(dependencies),
      isLocationOwner: isLocationOwner(dependencies),
      checkIn: checkIn(dependencies),
      checkinAllowed: checkinAllowed(dependencies),
      checkoutAllowed: checkoutAllowed(dependencies),
      checkout: checkout(dependencies),
      persistDiagnostic: persistDiagnostic(dependencies),
      isInfected: isInfected(dependencies),
      isPossiblyInfected: isPossiblyInfected(dependencies),
      isAdmin: isAdmin(dependencies),
      fetchAllLocations: fetchAllLocations(dependencies),
      fetchOwnedLocations: fetchOwnedLocations(dependencies),
      locationsCount: locationsCount(dependencies),
      usersCount: usersCount(dependencies),
      infectedCount: infectedCount(dependencies),
      possibleContagionCount: possibleContagionCount(dependencies),
      persistConfigurations: persistConfigurations(dependencies),
      fetchConfigurations: fetchConfigurations(dependencies),
      fetchUnsentNotifications: fetchUnsentNotifications(dependencies),
      sendNotifications: sendNotifications(dependencies)
   }
}