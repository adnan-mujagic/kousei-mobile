import fetchDataWithAuth from "./fetchDataWithAuth";
import fetchDataWithoutAuth from "./fetchDataWithoutToken";


export default async function getUserDataWithUpdatedLocation(id, coordinates, token){
    let body = {
        coordinates: coordinates
    }
    console.log(body)
    const user = await fetchDataWithAuth("/users/"+id, "PUT", body, token);
    const userPosts = await fetchDataWithoutAuth("/users/"+id+"/posts", "GET");
    let errors = null;

    if(!user?.data || !userPosts.data){
        errors = "DATA MISSING";
    }

    return {...user.data, user_posts: userPosts.data, errors};
}