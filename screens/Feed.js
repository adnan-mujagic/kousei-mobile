import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Dimensions, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import AppHeader from '../components/AppHeader'
import Post from '../components/Post'
import fetchDataWithAuth from '../general_functions/fetchDataWithAuth'
import fetchDataWithoutAuth from '../general_functions/fetchDataWithoutToken'
import storeTokenToAsync from '../general_functions/storeTokenToAsync'
import grayColor from '../general_styles/grayColor'
import primaryColor from '../general_styles/primaryColor'
import { selectPosts, selectToken, selectUser, setMappedUsers, setPosts, setToken, setUser } from '../slices/mainSlice'

const Feed = () => {

    const dispatch = useDispatch();

    const user = useSelector(selectUser)

    const posts = useSelector(selectPosts);

    const token = useSelector(selectToken);

    const navigation = useNavigation();

    const [modalOpen, setModalOpen] = useState(false)

    const logOut = async () => {
        await storeTokenToAsync(null)
        dispatch(setToken(null));
        dispatch(setUser(null));
        dispatch(setMappedUsers(null))
        dispatch(setPosts([]))
    }

    useEffect(() => {
        console.log("getting posts")
        async function getPosts(){
            if(!token){
                return;
            }
            const res = await fetchDataWithAuth("/posts?order=normal", "GET", undefined, token)
            console.log(res)
            if(res?.data){
                dispatch(setPosts(res.data));
            }
        }
        getPosts()
    }, [token])

    return (
        <View style={{backgroundColor:"white", flex:1}}>
            {posts?.length!=0 ? <FlatList
                style={{marginTop:40}} 
                data={posts}
                keyExtractor={(item) => item._id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({item})=> (
                    <Post item={item}/>
                )}
                
            /> : <View>
                <Text style={{ margin:40}}>Nothing to show here</Text>
            </View>}
        </View>
    )
}

export default Feed

const styles = StyleSheet.create({
    main:{
        paddingTop:50
    },
    optionText:{
        padding:16,
        borderBottomColor:grayColor(),
        borderBottomWidth:0.2,
        color:"rgb(100,100,100)",
        fontSize:16,
        fontWeight:"bold"
    }
})
