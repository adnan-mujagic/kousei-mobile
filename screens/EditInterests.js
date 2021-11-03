import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, TextInput, ToastAndroid, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import CustomButton from '../components/CustomButton'
import arraysEqual from '../general_functions/arraysEqual'
import fetchDataWithoutAuth from '../general_functions/fetchDataWithoutToken'
import { selectRequestedUser, selectToken, selectUser, setRequestedUser, setUser } from '../slices/mainSlice'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import grayColor from '../general_styles/grayColor'
import primaryColor from '../general_styles/primaryColor'
import fetchDataWithAuth from '../general_functions/fetchDataWithAuth'

const EditInterests = () => {

    const dispatch = useDispatch()
    
    const user = useSelector(selectUser)

    const requestedUser = useSelector(selectRequestedUser)

    const token = useSelector(selectToken)

    const initialInterests = user.interests;

    const [interests, setInterests] = useState(initialInterests)

    const [searchedInterests, setSearchedInterests] = useState([])

    const [search, setSearch] = useState("");

    const handleCheck = (isChecked, id) => {
        if(isChecked){
            setInterests([...interests, id])
        }else{
            setInterests(interests.filter(interest => interest !== id))
        }
    }

    const onSubmit = async () => {
        console.log("Submitted")
        const res = await fetchDataWithAuth("/users/"+user._id, "PUT", {interests}, token )
        if(res?.data){
            dispatch(setUser({...user, ...res.data}))
            dispatch(setRequestedUser({...requestedUser, ...res.data}))
        }
        ToastAndroid.show(res.status, ToastAndroid.SHORT);
    }

    useEffect(()=>{
        async function getAllInterests(){
            const res = await fetchDataWithoutAuth("/interests?search=" + search)
            if(res?.data){
                setSearchedInterests(res.data);
            }
        }
        getAllInterests()
    },[search])

    console.log("EDIT INTERESTS HEHREH")
    console.log(searchedInterests)

    return (
        <View style={{flex:1, backgroundColor:"white"}}>
            <View style={{paddingTop:40, paddingBottom:10, elevation:5, backgroundColor:"white"}}>
            <Text style={{marginLeft:10, fontWeight:"bold", fontSize:20}}>EDIT INTERESTS</Text>
            </View>
            <TextInput placeholder="Search interests..." onChangeText = {(text) => setSearch(text)} style={{paddingVertical:8, paddingHorizontal:10, borderRadius:5, fontSize:16, backgroundColor:"white", elevation:5, margin:10}} />
            
            <FlatList 
                data={searchedInterests}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({item}) => (
                    <View style={{marginVertical:8, marginHorizontal:10}}>
                    <BouncyCheckbox
                        size={25}
                        fillColor={primaryColor()}
                        unfillColor="#FFFFFF"
                        text={item.name}
                        isChecked={interests.includes(item._id)}
                        iconStyle={{ borderColor: grayColor(), borderRadius: 5}}
                        textStyle={{ textDecorationLine: "none" }}
                        onPress={(isChecked) => handleCheck(isChecked, item._id)}
                        bounceEffect={1}
                    />
                    </View>
                )}
            />
            
            <CustomButton onPress={onSubmit} responsive disabled={arraysEqual(interests, initialInterests)} title="Submit" type={arraysEqual(interests, initialInterests)?undefined: "solid"}/>
        </View>
    )
}

export default EditInterests

const styles = StyleSheet.create({})
