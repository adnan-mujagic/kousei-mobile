import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import ListItem from '../components/ListItem';
import calculateEstimatedPosition from '../general_functions/calculateEstimatedPosition';
import { AntDesign } from '@expo/vector-icons';
import recencyCompare from '../general_functions/recencyCompare';
import primaryColor from '../general_styles/primaryColor';
import grayColor from '../general_styles/grayColor';

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
            <View style={{paddingTop:50, paddingBottom:10, flexDirection:"row", alignItems:"center", backgroundColor:"white", paddingHorizontal:10, elevation:5}}>
            <Text style={{fontWeight:"bold", fontSize:20}}>POSITION</Text>
            <View>
            </View>
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
