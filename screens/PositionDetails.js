import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import ListItem from '../components/ListItem';
import calculateEstimatedPosition from '../general_functions/calculateEstimatedPosition';
import grayColor from '../general_styles/grayColor';
import primaryColor from '../general_styles/primaryColor';

const PositionDetails = ({route}) => {

    const users = route.params;

    const [estimatedCoordinates, setEstimatedCoordinates] = useState(null);

    useEffect(()=>{
        let coords = []
        for(let i=0;i<users.length; i++){
            coords.push(users[i].coordinates)
        }
        console.log(coords);
        let est = calculateEstimatedPosition(coords);
        setEstimatedCoordinates(est);
    },[])

    return (
        <View style={{flex:1, backgroundColor:"white"}}>
            <View style={{paddingTop:50, paddingBottom:10, paddingHorizontal:10, elevation:5}}>
            <Text style={{fontWeight:"bold", fontSize:17}}>Position Details</Text>
            </View>
            {estimatedCoordinates && <View style={{marginHorizontal:10, flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
            <View>
            <Text style={{color:"black"}}>Latitude</Text>
            <Text style={{color:primaryColor(), fontWeight:"bold", fontSize:20}}>{Math.round(estimatedCoordinates.latitude * 10**7)/10**7}</Text>
            </View>
            <View>
            <Text style={{color:"black"}}>Longitude</Text>
            <Text style={{color:primaryColor(), fontWeight:"bold", fontSize:20}}>{Math.round(estimatedCoordinates.longitude * 10**7)/10**7}</Text>
            </View>
            </View>}
            <Text style={{ fontWeight:"bold", marginHorizontal:10, marginTop:10}}>Recently There</Text>
            <FlatList 
                data={users}
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
