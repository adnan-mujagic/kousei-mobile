import React, { useEffect, useState } from 'react'
import { Alert, Dimensions, FlatList, Image, StyleSheet, Switch, Text, ToastAndroid, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import CustomButton from '../components/CustomButton'
import Post from '../components/Post'
import fetchDataWithAuth from '../general_functions/fetchDataWithAuth'
import fetchDataWithoutAuth from '../general_functions/fetchDataWithoutToken'
import getAllUserData from '../general_functions/getAllUserData'
import trimString from '../general_functions/trimString'
import generalMainStyle from '../general_styles/generalMainStyle'
import grayColor from '../general_styles/grayColor'
import primaryColor from '../general_styles/primaryColor'
import { AntDesign } from '@expo/vector-icons';
import { selectRequestedUser, selectToken, selectUser, setPosts, setRequestedUser, setUser } from '../slices/mainSlice'
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core'

const ProfileScreen = () => {

    const dispatch = useDispatch();

    const navigation = useNavigation()

    const requestedUser = useSelector(selectRequestedUser);

    const user = useSelector(selectUser);

    const token = useSelector(selectToken);

    const [postType, setPostType] = useState("quotes");

    const [isFollowed, setIsFollowed] = useState(false)

    const [displayedPosts, setDisplayedPosts] = useState(null)

    useEffect(()=>{
        async function getData(){
            const res = await getAllUserData(requestedUser._id)
            if(res){
                dispatch(setRequestedUser(res));
                setDisplayedPosts(filterPosts("quotes", res.posts))
                let followed = findIfFollowed(res.followers, user._id);
                setIsFollowed(followed);
            }
            else{
                Alert.alert("Problem", res.status);
            }
        }
        getData()
    },[])

    const onEditProfilePress = () => {
        console.log("EditProfilePressed")
        navigation.navigate("EditProfile")
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

    const findIfFollowed = (followers, userId) => {
        console.log("Is followed Called")
        console.log(followers)
        for(let i = 0; i<followers.length; i++){
            if(followers[i]._id == userId){
                return true;
            }
        }
        return false;
    }

    const handleFollowUnfollow = async (type, userId) => {
        let suffix = "/users/"+userId;
        console.log(type)
        if(type=="follow"){
            suffix+="/followers"
        }else{
            suffix+="/unfollow"
        }
        const res = await fetchDataWithAuth(suffix, "PUT", undefined, token);
        if(res){
            ToastAndroid.show(res.status, ToastAndroid.SHORT)
        }

        const newUser = await getAllUserData(requestedUser._id);
        if(newUser){
            dispatch(setRequestedUser(newUser));
        }

        setIsFollowed(!isFollowed)
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
            <View style={{paddingTop:50, paddingBottom:10, backgroundColor:"white", flexDirection:"row", alignItems:"center", marginBottom:10, paddingHorizontal:10, elevation:5}}>
            <Text style={{fontWeight:"bold", fontSize:20}}>PROFILE</Text>
            </View>
            <View style={generalMainStyle.row}>
                <Image source={{uri:requestedUser.profile_picture}} style={{height:90, width:90, marginLeft:10, borderRadius:45, borderWidth:0.5, borderColor:grayColor(), marginBottom:10}} />
                <View style={{marginLeft:10}}>
                <Text style={{fontWeight:"bold", fontSize:18}}>{requestedUser.full_name}</Text>
                <Text style={{color:grayColor()}}>@{requestedUser.username}</Text>
                {requestedUser.bio && <Text style={{width:Dimensions.get("window").width*0.7}}>{trimString(requestedUser.bio, 50)}</Text>}
                </View>
            </View>
            <View style={{flexDirection:"row", justifyContent:"space-between", margin:10, marginTop:0}}>
            <View>
            <Text style={{fontSize:14}}>Posts</Text>
            <Text style={{fontSize:24}}>{requestedUser.posts.length}</Text>
            </View>
            <View >
            <Text style={{fontSize:14}}>Followers</Text>
            <Text style={{fontSize:24}}>{requestedUser.followers.length}</Text>
            </View>
            <View >
            <Text style={{fontSize:14}}>Following</Text>
            <Text style={{fontSize:24}}>{requestedUser.following.length}</Text>
            </View>
            </View>
            <View>
                {user._id != requestedUser._id? <CustomButton onPress={isFollowed?()=>handleFollowUnfollow("unfollow", requestedUser._id):()=>handleFollowUnfollow("follow",requestedUser._id)} title={isFollowed?"Unfollow":"Follow"} /> : <CustomButton onPress={onEditProfilePress} title="Edit Profile"/>}
            </View>
            <View style={[generalMainStyle.row,{ borderBottomColor:grayColor(), borderBottomWidth:0.5}]}>
                <TouchableOpacity disabled={postType=="quotes"} onPress={()=>onQuotesPress()} style={[{ borderBottomWidth:0.5, width: Dimensions.get("window").width/2, padding:10, alignItems:"center"}, postType=="quotes"?{borderBottomColor:primaryColor()}:{borderBottomColor:"white"}]}>
                <Text>Quotes</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={postType=="media"} onPress={()=>onMediaPress()} style={[{borderBottomWidth:0.5, width: Dimensions.get("window").width/2, padding:10, alignItems:"center"}, postType!="quotes"?{borderBottomColor:primaryColor()}:{borderBottomColor:"white"}]}>
                <Text>Media</Text>
                </TouchableOpacity>
            </View>
            <View style={{flex:1}}>
                {displayedPosts?.length!=0?
                    <FlatList
                        data={displayedPosts}
                        keyExtractor={(item)=>item._id.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item})=> {
                            const {username, profile_picture} = requestedUser;
                            return (
                                <Post handleDisabled item={{...item, creator:{username, profile_picture}}} />
                            )
                        }}
                        style={{flex:1}}
                    />:
                    <Text style={{textAlign:"center", marginTop:20, fontSize:16}}>No {postType} yet!</Text>
                }
            </View>
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({})
