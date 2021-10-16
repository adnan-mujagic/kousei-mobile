import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react'
import { Alert, Button, Dimensions, Modal, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { selectMappedUsers, selectToken, selectUser, setMappedUsers, setToken, setUser } from '../slices/mainSlice';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import CustomMapMarker from '../components/CustomMapMarker';
import AppHeader from '../components/AppHeader';
import { TouchableOpacity } from 'react-native';
import grayColor from '../general_styles/grayColor';
import getUserDataWithUpdatedLocation from '../general_functions/getUserDataWithUpdatedLocation';
import fetchDataWithoutAuth from '../general_functions/fetchDataWithoutToken';
import transformToMappableUsersOnly from '../general_functions/transformToMappableUsersOnly';

const HomeScreen = () => {

    const [location, setLocation] = useState(null);

    const [errorMsg, setErrorMsg] = useState(null);

    const [modalOpen, setModalOpen] = useState(false)

    const navigation = useNavigation();

    const dispatch = useDispatch()

    const user = useSelector(selectUser);

    const token = useSelector(selectToken);

    const mappedUsers = useSelector(selectMappedUsers);

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let {coords, timestamp} = await Location.getCurrentPositionAsync({});
          setLocation({longitude: coords.longitude, latitude: coords.latitude, updated: timestamp});
        })();
    }, []);

    useEffect(() => {
        async function updateData(){
            console.log("Update Fired")
            if(user?._id && token && location){
                const {longitude, latitude} = location;
                const userData = await getUserDataWithUpdatedLocation(user._id, {longitude, latitude, updated: location.timestamp}, token );
                
                if(!userData?.errors){
                    console.log(userData)
                }
            }
        }
        async function getMappedUsers(){
            if(user){
                const usersToShowOnMap = await fetchDataWithoutAuth("/users", "GET");
                if(usersToShowOnMap?.data){
                    dispatch(setMappedUsers(transformToMappableUsersOnly(usersToShowOnMap.data)));
                }
            }else{
                Alert.alert("Tip", "Log in to show users on the map!")
            }
            
        }
        updateData().then(()=>getMappedUsers())
    }, [user])


    let text = 'Waiting..';
    if (errorMsg) {
        Alert.alert("Warning", "You can't access our maps screen without that permission!")
        navigation.navigate("Feed");
    } else if (location) {
        text = JSON.stringify(location);
    }

    const logOut = () => {
        dispatch(setToken(null));
        dispatch(setUser(null));
        dispatch(setMappedUsers(null))
    }

    console.log("homescreen")

    return (
        <View style={styles.main}>
        <Modal
            visible={modalOpen}
            animationType="slide"
            onRequestClose={()=> setModalOpen(!modalOpen)}
            transparent
        >   
            <TouchableOpacity style={{flex:1,}} onPress={()=>setModalOpen(false)}>
            <View style={{ backgroundColor:"white", position:"absolute", bottom:0, width:Dimensions.get("screen").width}}>
                {!user && <View style={{elevation:5, backgroundColor:"white"}}>
                    <TouchableOpacity onPress={()=>{navigation.navigate("LogIn"); setModalOpen(false)}}>
                        <Text style={styles.optionText}>Log In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.optionText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>}
                {user && <View>
                    <TouchableOpacity onPress={()=>{logOut(); setModalOpen(false)}}>
                        <Text style={styles.optionText}>Log Out</Text>
                    </TouchableOpacity>
                </View>}
            </View>
            </TouchableOpacity>
        </Modal>
        <AppHeader modalOpen={modalOpen} setModalOpen={setModalOpen}/>
        <MapView 
            initialRegion={location && {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta:0.001,
                longitudeDelta: 0.001,
            }} 
            mapType="standard"
            showsPointsOfInterest={false} 
            showsUserLocation={true} 
            style={{height:Dimensions.get("window").height}}
            showsCompass={false}
            showsUserLocation={false}
        >
            {(mappedUsers && mappedUsers?.length!=0) && mappedUsers.map(entry => (
                <CustomMapMarker key={entry._id} user={entry}></CustomMapMarker>
            ))}
        </MapView>
        
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    main:{backgroundColor:"white", flex:1},
    modalContainer:{
        flex:1,
        backgroundColor:"orange"
    },
    modal:{
        width:Dimensions.get("window").width,
        backgroundColor:"blue",
        height:100
    },
    optionText:{
        padding:16,
        borderBottomColor:grayColor(),
        borderBottomWidth:0.2,
        color:"rgb(100,100,100)",
        fontSize:16,
        fontWeight:"bold"
    }
    
})
