import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { selectUser } from '../slices/mainSlice'
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const AppHeader = ({modalOpen, setModalOpen}) => {

    const user = useSelector(selectUser)

    return (
        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding:10, paddingTop:50, elevation:5, backgroundColor:"white"}}>
            <Text style={{fontSize:20, fontWeight:"bold"}}>Kousei</Text>
            <TouchableOpacity onPress={()=>setModalOpen(!modalOpen)}>
            <Ionicons name="ios-menu" size={30} color="black" />
            </TouchableOpacity>
        </View>
    )
}

export default AppHeader

const styles = StyleSheet.create({})
