import main from "./positionallyMerge";

export default function transformToMappableUsersOnly(users){
    let mappableUsers = []
    console.log(users)
    if(users.length!=0){
        for(let i = 0; i < users.length; i++){
            if(users[i].coordinates?.longitude && users[i].coordinates?.latitude){
                const {_id, username, profile_picture, coordinates} = users[i];
                mappableUsers.push({_id, username, profile_picture, coordinates})
            }
        }
    }
    

    main(mappableUsers, 0.00005);
    console.log(mappableUsers)
    return mappableUsers;
}