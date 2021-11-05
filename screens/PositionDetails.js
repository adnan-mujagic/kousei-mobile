import React, { useEffect, useState } from 'react'
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ListItem from '../components/ListItem';
import calculateEstimatedPosition from '../general_functions/calculateEstimatedPosition';
import { AntDesign } from '@expo/vector-icons';
import recencyCompare from '../general_functions/recencyCompare';
import primaryColor from '../general_styles/primaryColor';
import grayColor from '../general_styles/grayColor';
import { useSelector } from 'react-redux';
import { selectUser } from '../slices/mainSlice';
import { useNavigation } from '@react-navigation/core';

const PositionDetails = ({route}) => {

    const users = route.params;

    const navigation = useNavigation()

    const loggedInUser = useSelector(selectUser)

    const [estimatedCoordinates, setEstimatedCoordinates] = useState(null);

    const [recentUsers, setRecentUsers] = useState(users);

    useEffect(()=>{
        let coords = []
        for(let i=0;i<users.length; i++){
            coords.push(users[i].coordinates)
        }
        console.log(coords);
        let est = calculateEstimatedPosition(coords);
        setEstimatedCoordinates(est);
        let orderedUsers = [];
        for(let i=0;i<users.length;i++){
            orderedUsers.push(users[i]);
        }
        orderedUsers.sort(recencyCompare);
        setRecentUsers(orderedUsers);
    },[])

    return (
        <View style={{flex:1, backgroundColor:"white"}}>
            <View style={{paddingTop:50, paddingBottom:10, flexDirection:"row", alignItems:"center", backgroundColor:"white", paddingHorizontal:10, elevation:5}}>
            <Text style={{fontWeight:"bold", fontSize:20}}>POSITION</Text>
            <View>
            </View>
            </View>
            {loggedInUser.interests.length == 0 && <View style={{backgroundColor:"purple", padding:10, borderRadius:10, margin:10}}>
                <Text style={{color:"white"}}>Make sure to have at least one interest so we can show your interests overlap with other users! </Text>
                <TouchableOpacity onPress={()=>{navigation.navigate("EditInterests")}} style={{backgroundColor:"white", padding:10, borderRadius:10, marginTop:10}}>
                    <Text style={{textAlign:"center"}}>Edit Interests</Text>
                </TouchableOpacity>
            </View>}
            <FlatList 
                data={recentUsers}
                keyExtractor={(item)=>item._id.toString()}
                renderItem={({item})=>(
                    <ListItem user={item} pressable/>
                )}
            />
        </View>
    )
}

export default PositionDetails

const styles = StyleSheet.create({})
