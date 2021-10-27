import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import generalMainStyle from '../general_styles/generalMainStyle'
import grayColor from '../general_styles/grayColor'
import primaryColor from '../general_styles/primaryColor'

const CustomButton = ({onPress, title, type, disabled=false}) => {

    console.log("button")
    
    return (
        <View>
            <TouchableOpacity disabled={disabled} onPress={()=>onPress()} style={(type=="solid" && !disabled)?generalMainStyle.solidButton:{backgroundColor:grayColor(), borderRadius:5, padding:8, margin:10}}>
                <Text style={{fontWeight:"bold", fontSize:15, textAlign:"center", color:type=="solid"?"white":primaryColor()}}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CustomButton

const styles = StyleSheet.create({})
