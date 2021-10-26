export default function trimString(string, maxLength){
    return string.length>maxLength? string.substring(0, maxLength-3)+"..." : string
}