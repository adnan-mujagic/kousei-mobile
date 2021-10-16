import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import generalMainStyle from '../general_styles/generalMainStyle'
import grayColor from '../general_styles/grayColor'
import primaryColor from '../general_styles/primaryColor'

const CustomInput = ({onChangeText, placeholder, password, fieldName}) => {
    
    const [focused, setFocused] = useState(false);

    console.log("Input")

    return (
        <View>
            <TextInput placeholder={placeholder} secureTextEntry={password} onChangeText={(text) => onChangeText(text, fieldName && fieldName)} onBlur={()=>setFocused(false)} onFocus={()=>setFocused(true)} style={[generalMainStyle.inputStyle, {borderColor:focused?primaryColor():grayColor()}]}/>
        </View>
    )
}

export default CustomInput

const styles = StyleSheet.create({})
