exports.present = function (data){
    if(data && data._id && data.toObject){
        data = data.toObject()
        data.id = data._id
        delete data._id
        if(data.position){
            let [longitude, latitude] = data.position.coordinates
            Object.assign(data, {longitude, latitude})
        }
    }
    return {status:200, data}
}