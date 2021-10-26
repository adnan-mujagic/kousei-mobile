export default function getMappableUnmerged(users){
    let mappableUnmergedUsers = [];
    
    for(let i=0;i<users.length; i++){
        if(users[i].coordinates){
            let updatedDate = new Date(users[i].coordinates.updated)
            let timeDifference = Date.now() - updatedDate.getTime();
            console.log("Time Difference"+timeDifference);
            if(timeDifference<=1000*60*60*24*7){
                mappableUnmergedUsers.push(users[i]);
            }
            
            
        }
    }
    return mappableUnmergedUsers;
}