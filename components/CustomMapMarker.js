import React, { useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { Callout, Marker } from 'react-native-maps'
import positionReliability from '../general_functions/positionReliability'
import prettyDate from '../general_functions/prettyDate'
import grayColor from '../general_styles/grayColor'
import primaryColor from '../general_styles/primaryColor'

const CustomMapMarker = ({user}) => {

    return (
        <Marker coordinate={user.coordinates} title={user.username+"'s Profile"} onCalloutPress={()=>{console.log("callout Pressed")}} >
        <View style={{}}>
            
            <View style={{borderWidth:0.5, borderColor:grayColor(), backgroundColor:"white", padding:10, borderRadius:5, maxWidth:120, maxHeight:160}}>
            <View style={{position:"absolute", top:10, right:10, width:8, height: 8, borderRadius: 4, backgroundColor: positionReliability(user.coordinates.updated)}}></View>
            <View style={{}}>
            <Image source={{uri:user.profile_picture}} style={{height:50, width:50, borderRadius:25, resizeMode:"cover", borderWidth:0.5, borderColor:grayColor()}}/>
            </View>
            <Text style={{fontSize:12, fontWeight:"bold", color:primaryColor()}}>{user.username}</Text>
            <Text style={{fontSize:11, color:grayColor()}}>Last seen: {prettyDate(user.coordinates.updated)}</Text>
            </View>
        </View>
        </Marker>
    )
}

export default CustomMapMarker

const styles = StyleSheet.create({})
