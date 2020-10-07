const errored = async()=> {throw new Error('Failure')}

function* futureError(erroredIteration){
    for (let it = 1; it < erroredIteration; it++) {
        yield true
        
    }
    throw 'Errored iteration'
}
const erroredAtNthCall = (nth)=>{
    let generator = futureError(nth)
    return  () => generator.next().value
}
const validTrue = async()=>true
const validFalse = async()=>false

class Returnable {
    constructor(){
        this.object = {id: (new Date).getTime()}
    }
    async func(){
        return this.object
    }
    isObject(object){
        return this.object.id === object.id
    }
}
class Assertable {
    constructor(){
        this._used = 0
    }
    async func(){
        this._used += 1
    }
    isUsed(){
        return this._used > 0
    }
    timesUsed(){
        return this._used
    }
}
function assertable(){
    let assertable = new Assertable()
    return {isUsed: assertable.isUsed.bind(assertable), func: assertable.func.bind(assertable),timesUsed: assertable.timesUsed.bind(assertable)}
}

function responder(){
    let returnable = new Returnable()
    return {isObject: returnable.isObject.bind(returnable), func: returnable.func.bind(returnable)}
}


module.exports = {responder, validTrue, validFalse, errored,erroredAtNthCall, assertable}