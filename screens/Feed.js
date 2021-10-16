import { useNavigation } from '@react-navigation/core'
import React, { useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { useDispatch } from 'react-redux'
import AppHeader from '../components/AppHeader'
import generalMainStyle from '../general_styles/generalMainStyle'
import { setUser } from '../slices/mainSlice'

const Feed = () => {

    const dispatch = useDispatch();

    const navigation = useNavigation();

    return (
        <View style={{backgroundColor:"white"}}>
            <AppHeader />
        </View>
    )
}

export default Feed

const styles = StyleSheet.create({
    main:{
        paddingTop:50
    }
})
