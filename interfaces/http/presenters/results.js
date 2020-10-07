exports.present = function (data){
    if(data && data._id && data.toObject){
        data = data.toObject()
        data.id = data._id
        delete data._id
    }
    return {status:200, data}
}