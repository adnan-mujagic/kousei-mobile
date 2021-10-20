import main from "./positionallyMerge";

export default function transformToMappableUsersOnly(users){
    let mappableUsers = []
    for(let i = 0; i < users.length; i++){
        if(users[i].coordinates?.longitude && users[i].coordinates?.latitude){
            const {_id, username, profile_picture, coordinates} = users[i];
            mappableUsers.push({_id, username, profile_picture, coordinates})
        }
    }

    main(mappableUsers, 0.00001);
    console.log(mappableUsers)
    return mappableUsers;
}