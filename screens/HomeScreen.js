import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react'
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux';
import { selectUser } from '../slices/mainSlice';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import CustomMapMarker from '../components/CustomMapMarker';

const HomeScreen = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const navigation = useNavigation();

    const user = useSelector(selectUser);

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let {coords} = await Location.getCurrentPositionAsync({});
          setLocation({longitude: coords.longitude, latitude: coords.latitude});
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <View style={styles.main}>
        {user && <Text>{user.name}</Text>}
        <Button title="Go Feed" onPress={()=>navigation.navigate("Feed")} />
        <Text>{text}</Text>
        <MapView 
            initialRegion={location && {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta:0.001,
                longitudeDelta: 0.001,
            }} 
            mapType="mutedStandard" 
            showsPointsOfInterest={false} 
            showsUserLocation={true} 
            style={{height:Dimensions.get("window").height}}
            showsCompass={false}
        >
            {location && <CustomMapMarker user={{coords: location, profile_picture: "https://d5nunyagcicgy.cloudfront.net/external_assets/hero_examples/hair_beach_v391182663/original.jpeg", username:"andan-mujagic"}}></CustomMapMarker>}
                
                
            
            
        
        </MapView>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    main:{paddingTop:50, flex:1},
    
})
