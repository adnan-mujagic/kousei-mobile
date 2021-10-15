import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { Marker } from 'react-native-maps'

const CustomMapMarker = ({user}) => {
    return (
        <Marker coordinate={user.coords}>
        <View >
            <View style={{backgroundColor:"white", padding:10, borderRadius:5, elevation:5, maxWidth:120, maxHeight:160}}>
            <View style={{alignItems:"center"}}>
            <Image source={{uri:user.profile_picture}} style={{height:40, width:40, borderRadius:20, resizeMode:"cover"}}/>
            </View>
            <Text style={{fontSize:16, fontWeight:"bold"}}>{user.username}</Text>
            <Text style={{fontWeight:"bold"}}>Interests</Text>
            <Text>Many interests here...</Text>
            </View>
        </View>
        </Marker>
    )
}

export default CustomMapMarker

const styles = StyleSheet.create({})
