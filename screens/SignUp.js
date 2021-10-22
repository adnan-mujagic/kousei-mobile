import { useNavigation } from '@react-navigation/core'
import jwtDecode from 'jwt-decode'
import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native'
import { useDispatch } from 'react-redux'
import CustomButton from '../components/CustomButton'
import CustomInput from '../components/CustomInput'
import NumberPicker from '../components/NumberPicker'
import checkForEmptyFields from '../general_functions/checkForEmptyFields'
import fetchDataWithoutAuth from '../general_functions/fetchDataWithoutToken'
import getUserData from '../general_functions/getUserData'
import storeTokenToAsync from '../general_functions/storeTokenToAsync'
import generalMainStyle from '../general_styles/generalMainStyle'
import { setToken, setUser } from '../slices/mainSlice'

const SignUp = () => {
    const [credentials, setCredentials] = useState({
        username:"",
        password:"",
        email:"",
        age:20
    })
    
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const dispatch = useDispatch();

    const navigation = useNavigation()

    const onChangeText = (text, fieldName) => {
        setCredentials(previousCredentials => {
            return {...previousCredentials, [fieldName]: text}
        })
    } 

    const onAgeChange = (value) => {
        if(value>=0 && value<=120){
            setCredentials(previousCred => {
                return {...previousCred, age: value}
            })
        }
    }

    const onPress = async () => {
        console.log("PRESSED")
        if(checkForEmptyFields(credentials)){
            Alert.alert("Warning", "All the fields should be filled!")
            return;
        }
        const res = await fetchDataWithoutAuth("/users", "POST", credentials);
        if(res?.data){
            const loginInfo = await fetchDataWithoutAuth("/users/login", "POST", {username: credentials.username, password: credentials.password});
            if(loginInfo?.token){
                await storeTokenToAsync(loginInfo.token);
                dispatch(setToken(loginInfo.token));
                const decoded = jwtDecode(loginInfo?.token)
                const user = await getUserData(decoded.uid);
                if(user){
                    dispatch(setUser(user));
                    navigation.goBack();
                }
                else{
                    Alert.alert("Error", "Problem getting user data!")
                }
            }
            else{
                Alert.alert("Error", "Problem occured while trying to log in!")
            }
            

        }
        else{
            Alert.alert("Error", res.status)
        }
    }

    console.log(credentials)

    return (
        <View style={[generalMainStyle.topMarginAndFlex, {justifyContent:"center"}]}>
            <View style={{margin:40, elevation:5, backgroundColor:"white", borderRadius:8}}>
                <Text style={{marginHorizontal:10, marginTop:10, fontSize:18, fontWeight:"bold"}}>Make an account</Text>
                <CustomInput fieldName="username" placeholder={"Username..."} onChangeText={onChangeText}/>
                <CustomInput fieldName="password" placeholder={"Password..."} password onChangeText={onChangeText}/>
                <CustomInput fieldName="email" placeholder={"E-Mail..."} onChangeText={onChangeText}/>
                <NumberPicker value={credentials.age} setValue={onAgeChange}/>
                <CustomButton title="REGISTER" onPress={onPress} type="solid" disabled={buttonDisabled}/>
            </View> 
        </View>
    )
}

export default SignUp

const styles = StyleSheet.create({})
