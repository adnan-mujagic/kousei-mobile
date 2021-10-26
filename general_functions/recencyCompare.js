export default function recencyCompare(a, b){
    if ( a.coordinates.updated < b.coordinates.updated){
        return 1;
    }
    if ( a.coordinates.updated > b.coordinates.updated){
        return -1;
    }
    return 0;
}