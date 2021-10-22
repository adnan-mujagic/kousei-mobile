import { useNavigation } from '@react-navigation/core'
import jwtDecode from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'
import CustomButton from '../components/CustomButton'
import CustomInput from '../components/CustomInput'
import checkForEmptyFields from '../general_functions/checkForEmptyFields'
import fetchDataWithoutAuth from '../general_functions/fetchDataWithoutToken'
import getUserData from '../general_functions/getUserData'
import generalMainStyle from '../general_styles/generalMainStyle'
import primaryColor from '../general_styles/primaryColor'
import { setToken, setUser } from '../slices/mainSlice'
import storeTokenToAsync from '../general_functions/storeTokenToAsync'

const LogInScreen = () => {

    const [credentials, setCredentials] = useState({
        username:"",
        password:""
    })

    const [buttonDisabled, setButtonDisabled] = useState(false);

    const dispatch = useDispatch();

    const navigation = useNavigation()

    console.log(credentials)

    const onChangeText = (text, fieldName) => {
        setCredentials(previousCredentials => {
            return {...previousCredentials, [fieldName]: text}
        })
    } 

    const onPress = async () => {
        if(checkForEmptyFields(credentials)){
            Alert.alert("Warning", "You must enter both username and password in order to proceed!")
        }
        else{
            setButtonDisabled(true)
            const res = await fetchDataWithoutAuth("/users/login","POST", credentials);
            if(res?.token){
                await storeTokenToAsync(res.token);
                dispatch(setToken(res.token));
                const decoded = jwtDecode(res.token);
                const userData = await getUserData(decoded.uid)
                dispatch(setUser(userData));
                navigation.goBack();
            }
            else{
                Alert.alert(res.status, "Please try again!")
                setButtonDisabled(false)
            }
        }
    }

    return (
        <View style={[generalMainStyle.topMarginAndFlex, {justifyContent:"center"}]}>
            <View style={{margin:40, elevation:5, backgroundColor:"white", borderRadius:8}}>
                <Text style={{marginHorizontal:10, marginTop:10, fontSize:18, fontWeight:"bold"}}>Enter your credentials</Text>
                <CustomInput fieldName="username" placeholder={"Username..."} onChangeText={onChangeText}/>
                <CustomInput fieldName="password" placeholder={"Password..."} password onChangeText={onChangeText}/>
                <CustomButton title="LOG IN" onPress={onPress} type="solid" disabled={buttonDisabled}/>
            </View> 
        </View>
        
    )
}

export default LogInScreen

const styles = StyleSheet.create({})
