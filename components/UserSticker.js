import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import trimString from '../general_functions/trimString'
import grayColor from '../general_styles/grayColor'
import primaryColor from '../general_styles/primaryColor'

const UserSticker = ({user, onStickerPress}) => {

    return (
        
        <View style={{width: 80, alignItems:"center"}}>
            <Image 
                source={{uri: user.profile_picture}}
                style={{height:50, width:50, borderRadius: 25, borderWidth:0.2, borderColor:grayColor()}}
            />
            <Text style={{fontSize:12}}>{trimString(user.username, 10)}</Text>
        </View>
  
    )
}

export default UserSticker

const styles = StyleSheet.create({})
