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
import NumberPicker from '../components/NumberPicker'

const LogInScreen = () => {

    const [credentials, setCredentials] = useState({
        username:"",
        password:"",
        email:"",
        age:20,
        full_name:""
    })

    const [loginOrSignUp, setLoginOrSignUp] = useState("login");

    const [buttonsDisabled, setButtonsDisabled] = useState(false);

    const dispatch = useDispatch();

    const navigation = useNavigation()

    console.log(credentials)

    const onChangeText = (text, fieldName) => {
        setCredentials(previousCredentials => {
            return {...previousCredentials, [fieldName]: text}
        })
    } 

    const onLogin = async () => {
        let {username, password} = credentials;
        if(checkForEmptyFields({username, password})){
            Alert.alert("Warning", "You must enter both username and password in order to proceed!")
        }
        else{
            setButtonsDisabled(true)
            const res = await fetchDataWithoutAuth("/users/login","POST", {username, password});
            if(res?.token){
                await storeTokenToAsync(res.token);
                dispatch(setToken(res.token));
                const decoded = jwtDecode(res.token);
                const userData = await getUserData(decoded.uid)
                dispatch(setUser(userData));
                navigation.navigate("Home")
            }
            else{
                Alert.alert(res.status, "Please try again!")
                setButtonsDisabled(false)
            }
        }
        
    }

    const onAgeChange = (value) => {
        setCredentials(prev => {
            return {...prev, age: value}
        })
    }

    const onRegister = async () => {
        console.log("REGISTER PRESSED")
        if(checkForEmptyFields(credentials)){
            Alert.alert("Warning", "All the fields should be filled!")
            return;
        }
        setButtonsDisabled(true);
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
                    navigation.navigate("Home");
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
        setButtonsDisabled(false);
    }

    return (
        <View style={[generalMainStyle.topMarginAndFlex, {justifyContent:"center"}]}>
            {loginOrSignUp=="login" ?<View style={{margin:40, elevation:5, backgroundColor:"white", borderRadius:8}}>
                <Text style={{marginHorizontal:10, marginTop:10, fontSize:18, fontWeight:"bold"}}>Enter your credentials</Text>
                <CustomInput value={credentials.username} fieldName="username" placeholder={"Username..."} onChangeText={onChangeText}/>
                <CustomInput value={credentials.password} fieldName="password" placeholder={"Password..."} password onChangeText={onChangeText}/>
                <CustomButton title="LOG IN" onPress={onLogin} type="solid" disabled={buttonsDisabled}/>
                <TouchableOpacity onPress={()=>setLoginOrSignUp("sign-up")} style={{marginBottom:10, marginLeft:10}}>
                    <Text style={{fontSize:16}}>Want to sign up?</Text>
                </TouchableOpacity>
            </View> :
            <View style={{margin:40, elevation:5, backgroundColor:"white", borderRadius:8}}>
                <Text style={{marginHorizontal:10, marginTop:10, fontSize:18, fontWeight:"bold"}}>Make an account</Text>
                <CustomInput value={credentials.username} fieldName="username" placeholder={"Username..."} onChangeText={onChangeText}/>
                <CustomInput value={credentials.password} fieldName="password" placeholder={"Password..."} password onChangeText={onChangeText}/>
                <CustomInput value={credentials.email} fieldName="email" placeholder={"E-Mail..."} onChangeText={onChangeText}/>
                <CustomInput value={credentials.full_name} fieldName="full_name" placeholder={"Full Name..."} onChangeText={onChangeText}/>
                <NumberPicker value={credentials.age} setValue={onAgeChange} placeholder="Age:"/>
                <CustomButton title="REGISTER" onPress={onRegister} type="solid" disabled={buttonsDisabled}/>
                <TouchableOpacity onPress={()=>setLoginOrSignUp("login")} style={{marginBottom:10, marginLeft:10}}>
                    <Text style={{fontSize:16}}>Want to log in?</Text>
                </TouchableOpacity>
            </View> 
        
        
        }
        </View>
        
    )
}

export default LogInScreen

const styles = StyleSheet.create({})
