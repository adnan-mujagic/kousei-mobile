import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import lightBlack from '../general_functions/lightBlack';
import Fire from '../Fire';
import { useSelector } from 'react-redux';
import { selectUser } from '../slices/mainSlice';
import ConversationListItem from '../components/ConversationListItem';


const ConversationsScreen = () => {

    const user = useSelector(selectUser)

    const navigation = useNavigation();

    const [conversations, setConversations] = useState([])

    useEffect(()=>{

        Fire.db().collection("conversations").where("participants", "array-contains", user._id)
        .onSnapshot((querySnapshot) => {
            var conversationsList = [];
            querySnapshot.forEach((doc) => {
                conversationsList.push({id: doc.id, ...doc.data()});
            });
            setConversations(conversationsList)
        });

    }, [])

    console.log(conversations)

    return (
        <View style={{flex:1, backgroundColor:"white"}}>
            <View style={{backgroundColor: "white", elevation:5, paddingTop:40, paddingBottom:10}}>
                <Text style={{fontSize:20, fontWeight:"bold", color:lightBlack(), paddingLeft: 10}}>CONVERSATIONS</Text>
            </View>
            <FlatList 
                data={conversations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => {
                    console.log(item)
                    return (
                    <ConversationListItem data={item} />
                )}}
            />
        </View>
    )
}

export default ConversationsScreen

const styles = StyleSheet.create({})
