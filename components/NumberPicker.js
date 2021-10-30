import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import grayColor from '../general_styles/grayColor';

const NumberPicker = ({value, setValue, placeholder}) => {

    const handleAction = (type) => {
        if(type=="+"){
            if(value<120){
                setValue(value+1)
            }
        }
        else if(type=="-"){
            if(value>0){
                setValue(value-1);
            }
        }
    }

    return (
        <View style={{flexDirection:"row",marginVertical:10, borderWidth:1, padding:10, borderColor:grayColor(), marginHorizontal:10,borderRadius:5, alignItems:"center", justifyContent:"space-between"}}>
            <View style={{flexDirection:"row", alignItems:"center"}}>
            <Text style={{color:"rgb(150, 150, 150)", fontSize:17}}>{placeholder} </Text>
            <Text style={{fontSize:17}}>{value}</Text>
            </View>
            <View style={{flexDirection:"row", alignItems:"center"}}>
                <TouchableOpacity onPress={()=>handleAction("+")}>
                    <AntDesign name="plus" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft:10}} onPress={()=>handleAction("-")}>
                    <AntDesign name="minus" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default NumberPicker

const styles = StyleSheet.create({})
