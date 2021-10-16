import fetchDataWithoutAuth from "./fetchDataWithoutToken";

export default async function getUserData(id){
    const user = await fetchDataWithoutAuth("/users/"+id, "GET");
    const userPosts = await fetchDataWithoutAuth("/users/"+id+"/posts", "GET");

    if(!user?.data || !userPosts.data){
        console.log("User data or posts missing!");
    }

    return {...user.data, user_posts: userPosts.data};
}