export default function calculateEstimatedPosition(arrayOfCoordinates){
    let sumLat = 0;
    let sumLong = 0;
    for(let i=0;i<arrayOfCoordinates.length;i++){
        sumLat+=arrayOfCoordinates[i].latitude;
        sumLong+=arrayOfCoordinates[i].longitude;
    }
    return {latitude: sumLat/arrayOfCoordinates.length, longitude: sumLong/arrayOfCoordinates.length}
}