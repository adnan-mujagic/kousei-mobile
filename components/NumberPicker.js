import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import grayColor from '../general_styles/grayColor';

const NumberPicker = ({value, setValue}) => {

    return (
        <View style={{flexDirection:"row",marginBottom:10, borderWidth:1, padding:10, borderColor:grayColor(), marginHorizontal:10,borderRadius:5, alignItems:"center", justifyContent:"space-between"}}>
            <Text>{value}</Text>
            <View style={{flexDirection:"row", alignItems:"center"}}>
                <TouchableOpacity onPress={()=>setValue(value+1)}>
                    <AntDesign name="plus" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft:10}} onPress={()=>setValue(value-1)}>
                    <AntDesign name="minus" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default NumberPicker

const styles = StyleSheet.create({})
