export default function getMappableUnmerged(users, currentUser){
    let mappableUnmergedUsers = [];
    
    for(let i=0;i<users.length; i++){
        if(users[i]._id == currentUser._id){
            console.log(users[i]);
        }
        if((users[i].shown_on_map==true || users[i]._id == currentUser._id) && users[i].coordinates ){
            let updatedDate = new Date(users[i].coordinates.updated)
            let timeDifference = Date.now() - updatedDate.getTime();
            if(timeDifference<=1000*60*60*24*7){
                mappableUnmergedUsers.push(users[i]);
            }
            
            
        }
    }
    return mappableUnmergedUsers;
}