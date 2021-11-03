export default function calculateInterestIntersection(loggedInUser, otherUser) {
    let allInterests = new Set(loggedInUser.interests.concat(otherUser.interests))
    if(allInterests.size<=0){
        return 0
    }
    let intersection = loggedInUser.interests.filter(value => otherUser.interests.includes(value));
    let overlap = intersection.length / allInterests.size
    return overlap;

}