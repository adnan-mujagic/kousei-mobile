import main from "./positionallyMerge";

export default function transformToMappableUsersOnly(users, currentUser){
    let mappableUsers = []
    if(users.length!=0){
        for(let i = 0; i < users.length; i++){
            if((users[i]._id == currentUser._id || users[i].shown_on_map) && users[i].coordinates ){
                let updatedDate = new Date(users[i].coordinates.updated)
                let timeDifference = Date.now() - updatedDate.getTime();
                if(timeDifference<=1000*60*60*24*7){
                    const {_id, username, profile_picture, coordinates} = users[i];
                    mappableUsers.push({_id, username, profile_picture, coordinates})
                }
                
            }
        }
    }

    main(mappableUsers, 0.00005);
    return mappableUsers;
}