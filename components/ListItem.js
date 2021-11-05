import { useNavigation } from '@react-navigation/core'
import React, { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import getUserData from '../general_functions/getUserData'
import positionReliability from '../general_functions/positionReliability'
import prettyDate from '../general_functions/prettyDate'
import shouldRenderOnline from '../general_functions/shouldRenderOnline'
import grayColor from '../general_styles/grayColor'
import { selectUser, setRequestedUser } from '../slices/mainSlice'
import { MaterialIcons } from '@expo/vector-icons';
import lightBlack from '../general_functions/lightBlack'
import CircularProgress from 'react-native-circular-progress-indicator';
import primaryColor from '../general_styles/primaryColor'

const ListItem = ({user, pressable}) => {

    const dispatch = useDispatch();

    const navigation = useNavigation();

    const loggedInUser = useSelector(selectUser);

    const [showInterestOverlap, setShowInterestOverlap] = useState(false);

    const onListItemPress = async () => {
        console.log("pressed")
        const res = await getUserData(user._id);
        if(res){
            dispatch(setRequestedUser(res));
            navigation.navigate("ProfileScreen");
        }
    }

    return (
        <TouchableOpacity style={{borderBottomColor:grayColor(), borderBottomWidth:0.2}} disabled={!pressable} onPress={()=>onListItemPress()}>
        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
        <View style={{padding: 10,  flexDirection:"row", alignItems:"center"}}>
            <View style={{position:"relative"}}>
            <Image style={{height:50, width:50, borderRadius:25, borderWidth:0.2, borderColor:grayColor()}} source={{uri: user.profile_picture}} />
            {shouldRenderOnline(user.coordinates.updated, 60) && <View style={{position:"absolute", width:16, height:16, backgroundColor:"white", borderRadius:8, bottom:0, right:0, alignItems:"center", justifyContent:"center"}}>
            <View style={{backgroundColor:positionReliability(user.coordinates.updated), height:12, width:12, borderRadius:6}}></View>
            </View>}
            </View>
            <View style={{marginLeft:10}}>
            <Text style={{fontWeight:"bold"}}>{user.username}</Text>
            <Text style={{fontSize:12, color:grayColor()}}>Last seen: {prettyDate(user.coordinates.updated)}</Text>
            </View>
            
        </View>
        {(user._id != loggedInUser._id && loggedInUser.interests.length!=0) && <TouchableOpacity style={{marginRight:10}} onPress={()=>setShowInterestOverlap(!showInterestOverlap)}>
                <MaterialIcons name={showInterestOverlap?"expand-less":"expand-more"} size={27} color={lightBlack()} />
        </TouchableOpacity>}
        </View>
        {showInterestOverlap && <View style={{marginRight:10,marginLeft:5, marginBottom:10, flexDirection:"row", alignItems:"center"}}>
            
            <CircularProgress 
                value={user.overlap * 100} 
                radius={27}
                duration={700}
                activeStrokeColor={primaryColor()}
                activeStrokeSecondaryColor={'#C25AFF'}
                inActiveStrokeColor={"rgb(215,215,215)"}
                textStyle={{display:"none"}}
                activeStrokeWidth={6}
                inActiveStrokeOpacity={0.5}
                inActiveStrokeWidth={6}
            />  
            <Text style={{fontSize:16, color:primaryColor(), marginLeft:10}}>{"Interest Overlap: " + (Math.round(user.overlap * 100)) + "%"}</Text>
         
        </View>}
        </TouchableOpacity>
    )
}

export default ListItem

const styles = StyleSheet.create({})
