import React, { useState } from 'react'
import { Alert, Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import prettyDate from '../general_functions/prettyDate'
import generalMainStyle from '../general_styles/generalMainStyle'
import grayColor from '../general_styles/grayColor'
import { Ionicons, Octicons } from '@expo/vector-icons';
import jwtDecode from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { selectToken, selectUser, setRequestedPost } from '../slices/mainSlice'
import fetchDataWithAuth from '../general_functions/fetchDataWithAuth'
import primaryColor from '../general_styles/primaryColor'
import { useNavigation } from '@react-navigation/core'

const Post = ({item, disabled}) => {

    const navigation = useNavigation();

    const token = useSelector(selectToken)

    const user = useSelector(selectUser);

    const dispatch = useDispatch();

    const decoded = jwtDecode(token)

    const [liked, setLiked] = useState(item.likes.includes(decoded.uid))

    const [likes, setLikes] = useState(item.likes.length);

    const [commentsOpen, setCommentsOpen] = useState(false);

    const [yourComment, setYourComment] = useState("");

    const [lastSubmittedComment, setLastSubmittedComment] = useState(null)

    const handleLeaveComment = async () => {
        setYourComment("");
        setCommentsOpen(false);
        const res = await fetchDataWithAuth("/posts/"+item._id+"/comments", "POST", {content: yourComment}, token);
        if(res?.data){
            const post = await fetchDataWithAuth("/posts/"+item._id, "GET");
            const comments = await fetchDataWithAuth("/posts/"+item._id+"/comments", "GET");
            dispatch(setRequestedPost({...post.data, post_comments: comments.data}))
            console.log(res.data);
            setLastSubmittedComment(res.data.content);
        }
    }

    const onPostPress = () => {
        console.log("post pressed")
        dispatch(setRequestedPost(item));
        navigation.navigate("PostScreen");
    }

    const onHeartClick = async () => {
        if(!token){
            Alert.alert("Tip", "Log in to like posts!");
            return;
        }
        if(liked){
            setLiked(false);
            const res = await fetchDataWithAuth("/posts/"+item._id+"/unlike", "PUT", undefined, token)
            setLikes(likes-1);
            console.log(res.status)
        }
        if(!liked){
            setLiked(true);
            const res = await fetchDataWithAuth("/posts/"+item._id+"/like", "PUT", undefined, token);
            setLikes(likes+1)
            console.log(res.status)
        }
    }

    return (
        <TouchableOpacity disabled={disabled} onPress={()=>onPostPress()}>
        <View style={{borderBottomWidth:0.5 , borderBottomColor:grayColor()}}>
            <View style={[generalMainStyle.row, {padding:10}]}>
                <Image source={{uri: item.creator.profile_picture}} style={{height:40, width:40, resizeMode:"cover", borderRadius:20, marginRight:10, borderColor:grayColor(), borderWidth:0.5}}/> 
                <Text style={{fontWeight:"bold", fontSize:16}}>{item.creator.username}</Text>
            </View>
            {item.image!="" && item.image!=null && <View>
                <Image source={{uri: item.image}} style={{width:Dimensions.get("window").width, aspectRatio:16 / 9, resizeMode:"cover"}}/>
            </View>}
            <View>
                <Text style={{margin:10, marginTop: item.image? 10: 0}}>{item.caption}</Text>
                <View style={[generalMainStyle.row, {marginHorizontal:10, marginBottom:10,}]}>
                    {liked? <TouchableOpacity onPress={()=> onHeartClick()}><Ionicons name="heart" size={24} color={primaryColor()} /></TouchableOpacity> : <TouchableOpacity onPress={()=> onHeartClick()}><Ionicons name="heart-outline" size={24} color={"rgb(32,32,32)"} /></TouchableOpacity>}
                    <TouchableOpacity disabled={!item.comments_enabled} style={{marginLeft:5}} onPress={()=>setCommentsOpen(!commentsOpen)}><Octicons name="comment" size={22} color={item.comments_enabled?"black":grayColor()} /></TouchableOpacity>
                </View>
                <Text style={{color:"rgb(32,32,32)", marginHorizontal:10}}>{likes} likes</Text>
                <Text style={{marginHorizontal:10, marginBottom:10, fontSize:10, color:grayColor()}}>{prettyDate(item.created_at)}</Text>
                {(lastSubmittedComment && !disabled) && <View style={[generalMainStyle.row, {marginHorizontal:10, marginBottom:commentsOpen?0:10}]}><Image style={{height:20, width:20, borderWidth:0.5, borderColor:grayColor(), borderRadius:10, resizeMode:"cover", marginRight:5}} source={{uri: user.profile_picture}}/><Text>{lastSubmittedComment}</Text></View>}
                {commentsOpen && <View style={[generalMainStyle.row, {justifyContent:"space-between", marginBottom:10}]}>
                        <TextInput value={yourComment} onChangeText={(text)=> {setYourComment(text)}} style={{paddingHorizontal:10, flex:0.8}} placeholder="Your comment..." />
                        <TouchableOpacity onPress={()=>handleLeaveComment()} style={{padding:8, margin:2,borderRadius:10,}} disabled={(yourComment.length==0 || yourComment.length>100)}>
                            <Text style={{color:(yourComment=="" || yourComment.length>100)? grayColor(): primaryColor()}}>Post</Text>
                        </TouchableOpacity>
                </View>}
            </View>
        </View>
        </TouchableOpacity>
    )
}

export default Post

const styles = StyleSheet.create({})
