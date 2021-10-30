export default function areEqual(a, b){
    for(let key in a){
        if(a[key]!=b[key]){
            return false;
        }
    }
    for(let key in b){
        if(b[key]!=a[key]){
            return false;
        }
    }
    return true;
}