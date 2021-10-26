import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'
import getUserData from '../general_functions/getUserData'
import positionReliability from '../general_functions/positionReliability'
import prettyDate from '../general_functions/prettyDate'
import grayColor from '../general_styles/grayColor'
import { setRequestedUser } from '../slices/mainSlice'

const ListItem = ({user, pressable}) => {

    const dispatch = useDispatch();

    const navigation = useNavigation()

    const onListItemPress = async () => {
        console.log("pressed")
        const res = await getUserData(user._id);
        if(res){
            dispatch(setRequestedUser(res));
            navigation.navigate("ProfileScreen");
        }
    }

    return (
        <TouchableOpacity disabled={!pressable} onPress={()=>onListItemPress()}>
        <View style={{padding: 10, borderBottomColor:grayColor(), borderBottomWidth:0.2, flexDirection:"row", alignItems:"center"}}>
            <View style={{position:"relative"}}>
            <Image style={{height:50, width:50, borderRadius:25}} source={{uri: user.profile_picture}} />
            <View style={{position:"absolute", width:16, height:16, backgroundColor:"white", borderRadius:8, bottom:0, right:0, alignItems:"center", justifyContent:"center"}}>
            <View style={{backgroundColor:positionReliability(user.coordinates.updated), height:12, width:12, borderRadius:6}}></View>
            </View>
            </View>
            <View style={{marginLeft:10}}>
            <Text style={{fontWeight:"bold"}}>{user.username}</Text>
            <Text style={{fontSize:12, color:grayColor()}}>Last seen: {prettyDate(user.coordinates.updated)}</Text>
            </View>
        </View>
        </TouchableOpacity>
    )
}

export default ListItem

const styles = StyleSheet.create({})
