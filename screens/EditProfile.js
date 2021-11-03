import React, { useState } from 'react'
import { StyleSheet, Switch, Text, TextInput, ToastAndroid, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import CustomButton from '../components/CustomButton'
import areEqual from '../general_functions/areEqual'
import fetchDataWithAuth from '../general_functions/fetchDataWithAuth'
import lightBlack from '../general_functions/lightBlack'
import grayColor from '../general_styles/grayColor'
import primaryColor from '../general_styles/primaryColor'
import { selectRequestedUser, selectToken, selectUser, setRequestedUser, setUser } from '../slices/mainSlice'

const EditProfile = () => {

    const dispatch = useDispatch();

    const user = useSelector(selectUser);

    const token = useSelector(selectToken)

    const requestedUser = useSelector(selectRequestedUser)

    let initialState = {
        full_name: user.full_name,
        bio: user.bio,
        shown_on_map: user.shown_on_map!=null? user.shown_on_map: false
    }

    const [body, setBody] = useState(initialState)

    const onSubmit = async () => {
        const res = await fetchDataWithAuth("/users/" + user._id, "PUT", body, token);
        if(res?.data){
            dispatch(setUser({...user, ...res.data}))
            dispatch(setRequestedUser({...requestedUser, ...res.data}))
        }
        ToastAndroid.show(res.status, ToastAndroid.SHORT);
    }

    const onBodyChange = (value, fieldName) => {
        setBody(prevBody => {
            return {...prevBody, [fieldName]: value}
        })
    }

    console.log(body);
    console.log(initialState);

    console.log(areEqual(initialState, body))

    return (
        <View style={{flex:1, backgroundColor:"white"}}>
            <View style={{paddingTop:40, paddingBottom:10, elevation:5, backgroundColor:"white"}}>
            <Text style={{marginLeft:10, fontWeight:"bold", fontSize:20}}>EDIT PROFILE</Text>
            </View>
            <View style={{marginHorizontal:10, marginTop:10}}>
                <Text style={styles.option}>Full Name</Text>
                <TextInput
                    value={body.full_name}
                    placeholder="Full Name..."
                    onChangeText={(text) => onBodyChange(text, "full_name")}
                    style={styles.input}
                />
                <Text style={styles.option}>Bio</Text>
                <TextInput
                    value={body.bio}
                    placeholder="Short bio..."
                    onChangeText={(text) => onBodyChange(text, "bio")}
                    style={styles.input}
                />
                
                <View style={{flexDirection:"row",alignItems:"center", justifyContent:"space-between"}}>
                <Text style={styles.option}>Show On Map</Text>
                <Switch 
                    value={body.shown_on_map}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={body.shown_on_map ? primaryColor() : "#f4f3f4"}
                    onValueChange={(value) => onBodyChange(value, "shown_on_map")}
                />
                </View>
            </View>
            <CustomButton onPress={onSubmit} responsive disabled={areEqual(initialState, body)} title="Submit" type={areEqual(body, initialState)?undefined: "solid"}/>
            
        </View>
    )
}

export default EditProfile

const styles = StyleSheet.create({
    option: {
        fontSize:18,
        fontWeight:"bold",
        color:lightBlack(),
    },
    input:{
        fontSize:16,
        borderBottomWidth:1,
        borderBottomColor:grayColor(),
        color:"rgb(100, 100, 100)",
        paddingVertical:6,
        marginBottom:10
    }
})
