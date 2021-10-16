export default function checkForEmptyFields(object, exceptions = []){
    for(let key in object){
        if((object[key] == null || object[key] =="") && !exceptions.includes(key)){
            return true
        }
    }
    return false;
}