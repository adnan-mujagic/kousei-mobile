import React from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import prettyDate from '../general_functions/prettyDate'
import generalMainStyle from '../general_styles/generalMainStyle'
import grayColor from '../general_styles/grayColor'
import { selectRequestedPost, selectToken, selectUser, setRequestedPost } from '../slices/mainSlice'
import { Feather } from '@expo/vector-icons';
import fetchDataWithAuth from '../general_functions/fetchDataWithAuth'

const Comment = ({item}) => {

    const dispatch = useDispatch();

    const user = useSelector(selectUser)

    const token = useSelector(selectToken)

    const requestedPost = useSelector(selectRequestedPost)

    const removeComment = async () => {
        const res = await fetchDataWithAuth("/comments/"+item._id, "DELETE", undefined, token);
        const comments = await fetchDataWithAuth("/posts/"+requestedPost._id+"/comments", "GET", undefined, token);
        dispatch(setRequestedPost({...requestedPost, post_comments: comments.data}))
    }

    return (
        <View style={[generalMainStyle.row, {padding:5, justifyContent:"space-between"}]}>
            <View style={[generalMainStyle.row, {flex:0.8}]}>
                <Image source={{uri: item.creator.profile_picture}} style={{height:32, marginRight:5, width:32, borderRadius:16, borderColor:grayColor(), borderWidth:0.5}}/>
                <View>
                    <Text>{item.creator.username}: {item.content}</Text>
                    <Text style={{fontSize:10, color:grayColor()}}>{prettyDate(item.created_at)}</Text>
                </View>
            </View>
            {(item.creator._id==user._id) && <View>
                <TouchableOpacity style={{marginRight:5}} onPress={() => removeComment()}>
                <Feather name="delete" size={24} color="rgb(32,32,32)" />
                </TouchableOpacity>
            </View>}
            
        </View>
    )
}

export default Comment

const styles = StyleSheet.create({})
