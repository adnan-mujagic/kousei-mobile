import React, { useEffect } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Comment from '../components/Comment'
import Post from '../components/Post'
import fetchDataWithoutAuth from '../general_functions/fetchDataWithoutToken'
import grayColor from '../general_styles/grayColor'
import { selectRequestedPost, setRequestedPost } from '../slices/mainSlice'

const PostScreen = () => {

    const requestedPost = useSelector(selectRequestedPost);

    const dispatch = useDispatch();

    useEffect(() => {
        async function getMorePostDetails(){
            const res = await fetchDataWithoutAuth("/posts/"+requestedPost._id, "GET");
            const postComments = await fetchDataWithoutAuth("/posts/"+requestedPost._id+"/comments", "GET");
            if(res?.data){
                dispatch(setRequestedPost({...res.data, post_comments: postComments.data}));
            }
        }
        getMorePostDetails()
    }, [])

    console.log(requestedPost)

    return (
        <View style={{backgroundColor:"white", flex:1}}>
            <View style={{paddingTop:50, paddingBottom:10, paddingHorizontal:10, elevation:5}}>
                <Text style={{fontWeight:"bold", fontSize:17}}>Post</Text>
            </View>
            <Post item = {requestedPost} disabled/>
            {requestedPost.comments_enabled?<FlatList 
                data={requestedPost.post_comments}
                keyExtractor={(item)=> item._id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({item})=> (
                    <Comment item={item} />
                )}
            />: <View style={{padding:10}}><Text style={{color:grayColor(), fontSize:12}}>Comments for this post are disabled...</Text></View>}
        </View>
    )
}

export default PostScreen

const styles = StyleSheet.create({})
