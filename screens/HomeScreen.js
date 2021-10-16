import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react'
import { Alert, Button, Dimensions, Modal, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, selectUser, setToken, setUser } from '../slices/mainSlice';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import CustomMapMarker from '../components/CustomMapMarker';
import AppHeader from '../components/AppHeader';
import { TouchableOpacity } from 'react-native';
import grayColor from '../general_styles/grayColor';
import getUserDataWithUpdatedLocation from '../general_functions/getUserDataWithUpdatedLocation';

const HomeScreen = () => {

    const [location, setLocation] = useState(null);

    const [errorMsg, setErrorMsg] = useState(null);

    const [modalOpen, setModalOpen] = useState(false)

    const navigation = useNavigation();

    const dispatch = useDispatch()

    const user = useSelector(selectUser);

    const token = useSelector(selectToken);

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let {coords, timestamp} = await Location.getCurrentPositionAsync({});
          setLocation({longitude: coords.longitude, latitude: coords.latitude, timestamp});
        })();
    }, []);

    console.log(location)

    useEffect(() => {
        async function updateData(){
            if(user?._id && token && location){
                const {longitude, latitude} = location;
                const userData = await getUserDataWithUpdatedLocation(user._id, {longitude, latitude, updated: location.timestamp}, token );
                if(!userData?.errors){
                    dispatch(setUser(userData))
                }
            }
        }
        updateData()
        
    }, [location, token])


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
            <View style={{paddingTop:10, borderTopStartRadius:8, zIndex:5, borderTopEndRadius: 8, backgroundColor:"white", position:"absolute", bottom:0, width:Dimensions.get("screen").width}}>
                {!user && <View>
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
            {(location && user?.coordinates) && <CustomMapMarker user={user}></CustomMapMarker>}
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
        padding:10,
        borderBottomColor:grayColor(),
        borderBottomWidth:0.2,
        color:"rgb(32,32,32)",
        fontSize:16,
        fontWeight:"bold"
    }
    
})
