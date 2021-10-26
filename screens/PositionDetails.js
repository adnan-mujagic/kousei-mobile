import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import ListItem from '../components/ListItem';
import calculateEstimatedPosition from '../general_functions/calculateEstimatedPosition';
import { MaterialIcons } from '@expo/vector-icons'; 
import recencyCompare from '../general_functions/recencyCompare';

const PositionDetails = ({route}) => {

    const users = route.params;

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
            <View style={{paddingTop:50, paddingBottom:10, paddingHorizontal:10, elevation:5}}>
            <Text style={{fontWeight:"bold", fontSize:17}}>Position Details</Text>
            </View>
            <View style={{flexDirection:"row", alignItems:"center", paddingBottom:10}}>
            <MaterialIcons style={{marginLeft:10, marginRight:5}} name="timer" size={25} color="black" />
            <Text style={{ fontWeight:"bold"}}>Recently There</Text>
            </View>
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
