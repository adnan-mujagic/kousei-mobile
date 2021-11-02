import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useRef, useState } from 'react'
import { Alert, Button, Dimensions, FlatList, Modal, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { selectMappedUsers, selectToken, selectUser, setMappedUsers, setPosts, setRequestedUser, setToken, setUser } from '../slices/mainSlice';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import CustomMapMarker from '../components/CustomMapMarker';
import AppHeader from '../components/AppHeader';
import { TouchableOpacity } from 'react-native';
import grayColor from '../general_styles/grayColor';
import getUserDataWithUpdatedLocation from '../general_functions/getUserDataWithUpdatedLocation';
import fetchDataWithoutAuth from '../general_functions/fetchDataWithoutToken';
import transformToMappableUsersOnly from '../general_functions/transformToMappableUsersOnly';
import storeTokenToAsync from '../general_functions/storeTokenToAsync';
import jwtDecode from 'jwt-decode';
import getUserData from '../general_functions/getUserData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getMappableUnmerged from '../general_functions/getMappableUnmerged';
import UserSticker from '../components/UserSticker';
import recencyCompare from '../general_functions/recencyCompare';
import primaryColor from '../general_styles/primaryColor';

const HomeScreen = () => {

    const [location, setLocation] = useState(null);

    const [errorMsg, setErrorMsg] = useState(null);

    const [modalOpen, setModalOpen] = useState(false)

    const navigation = useNavigation();

    const dispatch = useDispatch()

    const user = useSelector(selectUser);

    const token = useSelector(selectToken);

    const mappedUsers = useSelector(selectMappedUsers);

    const [userList, setUserList] = useState([]);

    const _map = useRef();

    const onStickerPress = (lat, lng) => {
        if(_map.current){
            const newCamera = {
                center: {
                    latitude: lat,
                    longitude: lng,
                },
                zoom: 18
            }
            _map.current.animateCamera(newCamera, {duration: 1000})

        }
    }

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
            console.log("updating data")
            if(user?._id && token && location){
                const {longitude, latitude, updated} = location;
                const userData = await getUserDataWithUpdatedLocation(user._id, {longitude, latitude, updated}, token );
            }
        }
        async function getMappedUsers(){
            console.log("getting mapped users")
            if(user){
                const usersToShowOnMap = await fetchDataWithoutAuth("/users/", "GET");
                if(usersToShowOnMap?.data){
                    const {longitude, latitude, updated} = location;
                    dispatch(setMappedUsers(transformToMappableUsersOnly(usersToShowOnMap.data, user)));
                    let unorderedUsers = getMappableUnmerged(usersToShowOnMap.data, user);
                    setUserList(unorderedUsers.sort(recencyCompare));
                }
            }else{
                Alert.alert("Tip", "Log in to show users on the map!")
            }
        }
        updateData().then(()=>getMappedUsers())
    }, [user])

    useEffect(()=>{
        async function checkLoggedIn(){
            console.log("checking logged in")
            let asyncToken = await getAsyncToken();
            console.log(asyncToken);
            if(asyncToken){
                dispatch(setToken(asyncToken));
                let decoded = jwtDecode(asyncToken);
                let res = await getUserData(decoded.uid);
                dispatch(setUser(res))
            }
        }
        checkLoggedIn()
    },[])


    let text = 'Waiting..';
    if (errorMsg) {
        Alert.alert("Warning", "You can't access our maps screen without that permission!")
        navigation.navigate("Feed");
    } else if (location) {
        text = JSON.stringify(location);
    }

    const logOut = async () => {
        console.log("logged out")
        await AsyncStorage.removeItem("token");
        dispatch(setToken(null));
        dispatch(setUser(null));
        dispatch(setMappedUsers(null))
        dispatch(setPosts(null))
        setModalOpen(false);
    }

    const getAsyncToken = async () => {
        try {
            const value = await AsyncStorage.getItem('token')
            return value;
        } catch(e) {
            // error reading value
            console.log(e.message);
        }
    }

    const visitOwnProfile = () => {
        dispatch(setRequestedUser(user));
        navigation.navigate("ProfileScreen");
    }

    return (
        <View style={styles.main}>
        <Modal
            visible={modalOpen}
            animationType="slide"
            onRequestClose={()=> setModalOpen(!modalOpen)}
            transparent
        >   
            <TouchableOpacity style={{flex:1,}} onPress={()=>setModalOpen(false)}>
            <View style={{ backgroundColor:"white", elevation:5, position:"absolute", top: 80, right:10, maxWidth:Dimensions.get("screen").width - 200, minWidth:150, borderRadius:5}}>
                {user && <View>
                    <TouchableOpacity onPress={()=>{logOut()}}>
                        <Text style={styles.optionText}>Log Out</Text>
                    </TouchableOpacity>
                </View>}
            </View>
            </TouchableOpacity>
        </Modal>
        {user && <View style={{position: "absolute", zIndex:20, top:105, left:10}}>
            <TouchableOpacity onPress={()=>visitOwnProfile()} style={{paddingHorizontal:10, paddingVertical:8, elevation:5, backgroundColor:primaryColor(), borderRadius:5}}>
                <Text style={{color: "white"}}>Your Profile</Text>
            </TouchableOpacity>
        </View>}
        <AppHeader modalOpen={modalOpen} modalDisabled={user?false:true} setModalOpen={setModalOpen}/>
        {(user && userList.length!=0) && <View style={{position:"absolute", marginBottom:10, width: Dimensions.get("window").width-20, bottom:0, paddingVertical:10, backgroundColor:"white", elevation:5, borderRadius:5, left:10, zIndex:20}}>
        <Text style={{marginBottom:10, fontWeight:"bold", marginLeft:10}}>Recent Users</Text>
        <FlatList 
            data={userList}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item)=>item._id.toString()}
            renderItem={({item, index}) => (
                <TouchableOpacity onPress={()=>onStickerPress(item.coordinates.latitude, item.coordinates.longitude)}>
                <UserSticker user={item} onStickerPress={onStickerPress}/>
                </TouchableOpacity>
            )}
        />
        </View>}
        <MapView 
            initialRegion={location && {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta:0.001,
                longitudeDelta: 0.001,
            }}
            ref={_map} 
            mapType="standard"
            showsPointsOfInterest={false} 
            showsUserLocation={true} 
            style={{height:Dimensions.get("window").height}}
            showsCompass={false}
            showsUserLocation={false}
        >
            {(mappedUsers && mappedUsers?.length!=0) && mappedUsers.map(entry => {console.log(entry[0]); return(
                <CustomMapMarker key={entry[0]._id} user={entry}></CustomMapMarker>
            )})}
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
        paddingVertical: 8,
        paddingHorizontal:10,
        borderBottomColor:grayColor(),
        borderBottomWidth:0.2,
        color:"rgb(100,100,100)",
        fontWeight:"bold"
    }
    
})
