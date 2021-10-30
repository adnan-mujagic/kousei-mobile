import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import { Callout, Marker } from 'react-native-maps'
import { useSelector } from 'react-redux'
import calculateEstimatedPosition from '../general_functions/calculateEstimatedPosition'
import positionReliability from '../general_functions/positionReliability'
import prettyDate from '../general_functions/prettyDate'
import shouldRenderOnline from '../general_functions/shouldRenderOnline'
import grayColor from '../general_styles/grayColor'
import primaryColor from '../general_styles/primaryColor'
import { selectUser } from '../slices/mainSlice'
import MarkerWarning from './MarkerWarning'

const CustomMapMarker = ({user}) => {

    const navigation = useNavigation();

    const getArrayWithPositions = () => {
        let arrayWithPositions = [];
        for(let i=0;i<user.length;i++){
            arrayWithPositions.push({...user[i], position: i});
        }
        return arrayWithPositions
    }

    const loggedInUser = useSelector(selectUser);

    const checkIfLoggedInUserHere = () => {
        for(let i=0; i<user.length; i++){
            if(user[i]._id == loggedInUser?._id){
                return true;
            }
        }
        return false;
    }

    const getUsersTogetherString = () => {
        let title = "";
        if(user.length>3){
            title = user[0].username+", "+user[1].username+", "+user[2].username+" and "+ (user.length-3) +" more";
        }
        else{
            for(let i=0; i<user.length; i++){
                title+=user[i].username;
                if(i==user.length-2){
                    title+=" and ";
                }else if(i==user.length-1){
                    
                }else{
                    title+=", "
                }
            }

        }
        
        return title;
    }

    return (
        <Marker title={"View Position Details"} onCalloutPress={()=>navigation.navigate("PositionDetails", user)} coordinate={user[0].coordinates}>
        <View style={{}}>
            
            <View style={{borderWidth:0.3, borderColor:grayColor(), backgroundColor:"white", padding:10, borderRadius:5, maxWidth:150, maxHeigth:200}}>
            {(checkIfLoggedInUserHere() && !loggedInUser?.shown_on_map) && <MarkerWarning message="Only you can view your location! If you want to be visible to others change your profile settings!"/>}
            <View style={{}}>
                <FlatList
                    data={getArrayWithPositions().splice(0,3)}
                    horizontal
                    keyExtractor={(item) => item._id.toString()}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item})=> (
                        <View style={{ position:'relative', left:-25 * item.position}}>
                        <View style={{height:54, width:54, borderRadius:27, backgroundColor:"white", alignItems:"center", justifyContent:"center", overflow:"hidden", borderColor:"white",}}>
                        <Image source={{uri:item.profile_picture}} style={{height:50, width:50, borderRadius:25,  resizeMode:"cover", }}/>
                        </View>
                        {shouldRenderOnline(item.coordinates.updated, 60) && <View style={{position:"absolute", bottom:0, left:6, width:16, height:16, borderRadius:8, backgroundColor:"white", overflow:"hidden", alignItems:"center", justifyContent:"center"}}>
                        <View style={{ width:12, height:12, borderRadius: 6, backgroundColor: positionReliability(item.coordinates.updated)}}></View>
                        </View>}
                        </View>
                    )}
                />
            </View>
            <Text style={{fontSize:14, fontWeight:"bold", color:primaryColor()}}>{getUsersTogetherString()}</Text>
            <Text style={{fontSize:14, color:grayColor()}}>{user.length==1?"was here": "were together"}</Text>
            </View>
        </View>
        </Marker>
    )
}

export default CustomMapMarker

const styles = StyleSheet.create({})
