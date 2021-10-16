import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import generalMainStyle from '../general_styles/generalMainStyle'
import primaryColor from '../general_styles/primaryColor'

const CustomButton = ({onPress, title, type}) => {

    console.log("button")
    
    return (
        <View>
            <TouchableOpacity onPress={()=>onPress()} style={type=="solid"?generalMainStyle.solidButton:{}}>
                <Text style={{fontWeight:"bold", fontSize:17, textAlign:"center", color:type=="solid"?"white":primaryColor()}}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CustomButton

const styles = StyleSheet.create({})
