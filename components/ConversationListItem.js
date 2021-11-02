import React, { useEffect, useState } from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux';
import concatUsers from '../general_functions/concatUsers';
import fetchDataWithoutAuth from '../general_functions/fetchDataWithoutToken';
import lightBlack from '../general_functions/lightBlack';
import { selectUser } from '../slices/mainSlice';
import grayColor from "./../general_styles/grayColor"
import { useNavigation } from '@react-navigation/core'
import primaryColor from '../general_styles/primaryColor';

const ConversationListItem = ({data}) => {

    const navigation = useNavigation();

    const user = useSelector(selectUser)

    const [otherParticipants, setOtherParticipants] = useState([]);

    useEffect(() => {
        async function getOtherParticipants(){
            let fetchedUsers = []
            console.log(data.participants)
            for(let i = 0; i<data.participants.length; i++){
                console.log(data.participants[i])
                if(data.participants[i] != user._id){
                    let res = await fetchDataWithoutAuth("/users/"+data.participants[i], "GET");
                    if(res?.data){
                        fetchedUsers.push(res.data);
                    }
                }
            }
            setOtherParticipants(fetchedUsers);
        }
        getOtherParticipants()
        
    }, [])

    const goToChat = () => {
        navigation.navigate("ChatScreen", {convoId: data.id})
    }

    if(!otherParticipants.length){
        return null
    }

    return (
        <TouchableOpacity onPress={()=>goToChat()} style={{padding:10, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: grayColor()}}>
            <View style={{flexDirection:"row", alignItems:"center"}}>
                <View>
                <FlatList 
                    data = {otherParticipants}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor= {(item) => item._id.toString()}
                    renderItem={({item, index}) => (
                        <Image 
                            style={{height:50, width: 50, borderRadius: 25, borderWidth: StyleSheet.hairlineWidth, borderColor: grayColor()}}
                            source = {{uri: item.profile_picture}}
                        />
                    )}
                />
                </View>
                <View style={{marginLeft:10, }}>
                <Text style={{fontWeight:"bold", fontSize:16, color:primaryColor()}}>{concatUsers(otherParticipants, "full_name")}</Text>
                <Text style={{color:"rgb(100,100,100)", fontSize:12}}>{concatUsers(otherParticipants, "username")}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ConversationListItem

const styles = StyleSheet.create({})
