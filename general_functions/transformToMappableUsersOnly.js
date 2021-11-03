import calculateInterestIntersection from "./calculateInterestIntersection";
import main from "./positionallyMerge";

export default function transformToMappableUsersOnly(users, currentUser, merged){
    let mappableUsers = []
    if(users.length!=0){
        for(let i = 0; i < users.length; i++){
            if((users[i]._id == currentUser._id || users[i].shown_on_map) && users[i].coordinates ){
                let updatedDate = new Date(users[i].coordinates.updated)
                let timeDifference = Date.now() - updatedDate.getTime();
                if(timeDifference<=1000*60*60*24*7){
                    const {_id, username, profile_picture, coordinates, interests} = users[i];
                    mappableUsers.push({_id, username, profile_picture, coordinates, overlap: calculateInterestIntersection(currentUser, users[i])})
                }
                
            }
        }
    }

    //IT gets a max of a 100 people according to the interest overlap for now!
    mappableUsers = mappableUsers.slice(0, 100);
    mappableUsers.sort(overlapCompare)

    if(merged){
        main(mappableUsers, 0.00005);
    }
    
    return mappableUsers;
}

function overlapCompare(a, b){
    if(a.overlap > b.overlap){
        return -1
    }
    else if(a.overlap < b.overlap){
        return 1
    }
    else return 0
}