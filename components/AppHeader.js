import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { selectUser } from '../slices/mainSlice'
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import primaryColor from '../general_styles/primaryColor';

const AppHeader = ({modalOpen, setModalOpen, modalDisabled}) => {

    const user = useSelector(selectUser)

    return (
        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding:10, paddingTop:50, elevation:5, backgroundColor:"white"}}>
            <View style={{flexDirection:"row", alignItems:"center"}}>
                <Text style={{fontSize:20, fontWeight:"bold", color:"rgb(32,32,32)"}}>FACEMAPP</Text>
                <Ionicons name="ios-compass" size={24} color={primaryColor()} />
            </View>
            {!modalDisabled && <TouchableOpacity onPress={()=>setModalOpen(!modalOpen)}>
            <Ionicons name="ios-menu" size={30} color="black" />
            </TouchableOpacity>}
        </View>
    )
}

export default AppHeader

const styles = StyleSheet.create({})
