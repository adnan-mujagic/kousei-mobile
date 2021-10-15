import { useNavigation } from '@react-navigation/core'
import React, { useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { setUser } from '../slices/mainSlice'

const Feed = () => {
    const [userX, setUserX] = useState({
        name:""
    })

    const dispatch = useDispatch();

    const navigation = useNavigation();

    return (
        <View style={styles.main}>
            <TextInput placeholder="Username" value={userX.name} onChangeText={(text)=>{setUserX({...userX, name: text})}}/>
            <Button title="Submit" onPress={()=>{
                console.log(userX)
                dispatch(setUser(userX))
                navigation.goBack()
            }} />
        </View>
    )
}

export default Feed

const styles = StyleSheet.create({
    main:{
        paddingTop:50
    }
})
