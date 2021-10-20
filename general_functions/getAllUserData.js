import { Alert } from "react-native";
import fetchDataWithoutAuth from "./fetchDataWithoutToken";

export default async function getAllUserData(id){
    const user = await fetchDataWithoutAuth("/users/"+id, "GET");
    const userPosts = await fetchDataWithoutAuth("/users/"+id+"/posts", "GET");

    if(user?.data && userPosts?.data){
        return {...user.data, posts: userPosts.data, all_fetched: true}
    }
    else{
        Alert.alert("Something went wrong");
    }
}