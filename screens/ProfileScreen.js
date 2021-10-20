import React, { useEffect, useState } from 'react'
import { Alert, Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import CustomButton from '../components/CustomButton'
import Post from '../components/Post'
import fetchDataWithAuth from '../general_functions/fetchDataWithAuth'
import fetchDataWithoutAuth from '../general_functions/fetchDataWithoutToken'
import getAllUserData from '../general_functions/getAllUserData'
import generalMainStyle from '../general_styles/generalMainStyle'
import grayColor from '../general_styles/grayColor'
import primaryColor from '../general_styles/primaryColor'
import { selectRequestedUser, selectToken, selectUser, setPosts, setRequestedUser } from '../slices/mainSlice'

const ProfileScreen = () => {

    const dispatch = useDispatch();

    const requestedUser = useSelector(selectRequestedUser);

    const user = useSelector(selectUser);

    const token = useSelector(selectToken);

    const [postType, setPostType] = useState("quotes");

    const [displayedPosts, setDisplayedPosts] = useState(null)

    useEffect(()=>{
        async function getData(){
            const res = await getAllUserData(requestedUser._id)
            if(res){
                dispatch(setRequestedUser(res));
                setDisplayedPosts(filterPosts("quotes", res.posts))
            }
            else{
                Alert.alert("Problem", res.status);
            }
        }
        getData()
    },[])

    const onEditProfilePress = () => {
        console.log("EditProfilePressed")
    }

    const onQuotesPress = () => {
        console.log("quotes pressed")
        setPostType("quotes")
        setDisplayedPosts(filterPosts("quotes", requestedUser.posts));
    }

    const onMediaPress = () => {
        console.log("media pressed")
        setPostType("media");
        setDisplayedPosts(filterPosts("media", requestedUser.posts));
    }

    const filterPosts = (type, posts) => {
        let filteredPosts = [];
        console.log(posts)
        console.log(type=="quotes")
        if(type=="quotes"){
            for(let i=0; i<posts.length;i++){
                if(posts[i].image==null || posts[i].image==""){
                    filteredPosts.push(posts[i]);
                }
            }
        }
        else{
            for(let i=0; i<posts.length;i++){
                if(posts[i].image!=null && posts[i].image!=""){
                    filteredPosts.push(posts[i]);
                }
            }
        }
        return filteredPosts;
    }

    const isFollowed = () => {
        console.log("Is followed Called")
        for(let i = 0; i<requestedUser.followers; i++){
            console.log(requestedUser.followers[i]._id)
        }
        return false;
    }

    const handleFollowOrUnfollow = async () => {
        let suffix = "/users/"+requestedUser._id;
        console.log(requestedUser.username);
        console.log(user._id)
        if(isFollowed()){
            suffix+="/unfollow";
        }
        else{
            suffix+="/followers";
        }
        const res = await fetchDataWithAuth(suffix, "PUT", undefined, token);
        const data = await getAllUserData(requestedUser._id);
        dispatch(setRequestedUser(data))
        Alert.alert("Success", res.status);
        
    }

    if(!requestedUser.all_fetched){
        return (
            <View style={{flex:1, backgroundColor:"white"}}>
                <View style={{paddingTop:50, paddingBottom:10, paddingHorizontal:10, elevation:5}}>
                <Text style={{fontWeight:"bold", fontSize:17}}>User Profile</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={{flex:1, backgroundColor:"white"}}>
            <View style={{paddingTop:50, paddingBottom:10, paddingHorizontal:10, elevation:5}}>
            <Text style={{fontWeight:"bold", fontSize:17}}>User Profile</Text>
            </View>
            <View style={generalMainStyle.row}>
                <Image source={{uri:requestedUser.profile_picture}} style={{height:90, width:90, marginLeft:10, borderRadius:45, borderWidth:0.5, borderColor:grayColor(), marginBottom:10}} />
                <View style={{marginLeft:10}}>
                <Text style={{fontWeight:"bold", fontSize:18}}>{requestedUser.full_name}</Text>
                <Text style={{color:grayColor()}}>{requestedUser.username}</Text>
                <Text>{requestedUser.biography}</Text>
                </View>
            </View>
            <View style={{flexDirection:"row", justifyContent:"space-between", margin:10, marginTop:0}}>
            <View>
            <Text style={{fontWeight:"bold"}}>Posts</Text>
            <Text>{requestedUser.posts.length}</Text>
            </View>
            <View >
            <Text style={{fontWeight:"bold",}}>Followers</Text>
            <Text>{requestedUser.followers.length}</Text>
            </View>
            <View>
            <Text style={{fontWeight:"bold",}}>Following</Text>
            <Text>{requestedUser.following.length}</Text>
            </View>
            </View>
            <View>
                {user._id != requestedUser._id? <CustomButton onPress={handleFollowOrUnfollow} type="solid" title={isFollowed()?"Unfollow":"Follow"} /> : <CustomButton type="solid" onPress={onEditProfilePress} title="Edit Profile"/>}
            </View>
            <View style={[generalMainStyle.row,{ borderBottomColor:grayColor(), borderBottomWidth:0.5}]}>
                <TouchableOpacity disabled={postType=="quotes"} onPress={()=>onQuotesPress()} style={[{ borderBottomWidth:0.5, width: Dimensions.get("window").width/2, padding:10, alignItems:"center"}, postType=="quotes"?{borderBottomColor:primaryColor()}:{borderBottomColor:"white"}]}>
                <Text>Quotes</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={postType=="media"} onPress={()=>onMediaPress()} style={[{borderBottomWidth:0.5, width: Dimensions.get("window").width/2, padding:10, alignItems:"center"}, postType!="quotes"?{borderBottomColor:primaryColor()}:{borderBottomColor:"white"}]}>
                <Text>Media</Text>
                </TouchableOpacity>
            </View>
            <View>
                {postType=="quotes"?
                <FlatList
                    data={displayedPosts}
                    keyExtractor={(item)=>item._id.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item})=> {
                        const {username, profile_picture} = requestedUser;
                        return (
                            <Post item={{...item, creator:{username, profile_picture}}} />
                        )
                    }}

                />
                :<Text>Pics</Text>

                }
            </View>
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({})
