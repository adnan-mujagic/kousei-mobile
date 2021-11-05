import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import generalMainStyle from '../general_styles/generalMainStyle'
import grayColor from '../general_styles/grayColor'
import primaryColor from '../general_styles/primaryColor'

const CustomButton = ({onPress, title, type, disabled=false, numCols = 1, responsive, rightMarginRequired}) => {

    console.log("button")
    
    return (
        <View>
            <TouchableOpacity disabled={disabled} onPress={()=>onPress()} style={[(type=="solid" && !disabled)?generalMainStyle.solidButton:{backgroundColor:"white", borderRadius:3, borderColor:grayColor(), borderWidth:0.5, padding:8, marginVertical:10, marginLeft:10}, responsive && {width: (Dimensions.get("screen").width - 10*(2+(numCols-1)))/numCols}, rightMarginRequired && {marginRight:10}]}>
                <Text style={{fontSize:15, textAlign:"center", color:type=="solid"?"white":primaryColor()}}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CustomButton

const styles = StyleSheet.create({})
