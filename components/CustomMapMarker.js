import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { Marker } from 'react-native-maps'
import grayColor from '../general_styles/grayColor'
import primaryColor from '../general_styles/primaryColor'

const CustomMapMarker = ({user}) => {
    return (
        <Marker coordinate={user.coordinates}>
        <View >
            <View style={{backgroundColor:"white", padding:10, borderRadius:5, elevation:5, maxWidth:120, maxHeight:160}}>
            <View style={{alignItems:"center"}}>
            <Image source={{uri:user.profile_picture}} style={{height:40, width:40, borderRadius:20, resizeMode:"cover"}}/>
            </View>
            <Text style={{fontSize:12, fontWeight:"bold", color:primaryColor()}}>{user.username}</Text>
            <Text style={{fontWeight:"bold", fontSize:12}}>Interests</Text>
            <Text style={{fontSize:10, color:grayColor()}}>Many interests here...</Text>
            </View>
        </View>
        </Marker>
    )
}

export default CustomMapMarker

const styles = StyleSheet.create({})
