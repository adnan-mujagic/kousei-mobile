import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import lightBlack from '../general_functions/lightBlack';

const MarkerWarning = ({message}) => {

    return (
        <View style={{borderColor: "rgba(255, 249, 71, 1)", marginBottom:5, backgroundColor:"rgba(255, 249, 71, 0.3)", borderWidth:1, borderRadius:3, padding:10}}>
            <AntDesign name="warning" size={13} color={lightBlack()} />
            <View>
            <Text style={{fontSize:10}}>{message}</Text>
            </View>
        </View>
    )
}

export default MarkerWarning

const styles = StyleSheet.create({})
