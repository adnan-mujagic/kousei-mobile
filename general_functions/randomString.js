export default function randomString(length){
    let availableCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let randomString = "";
    for(let i=0; i<length; i++){
        randomString+=availableCharacters.charAt(Math.floor(Math.random() * (availableCharacters.length - 1)))
    }
    return randomString
}