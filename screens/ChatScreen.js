import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Dimensions, FlatList, Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux';
import lightBlack from '../general_functions/lightBlack';
import grayColor from '../general_styles/grayColor';
import primaryColor from '../general_styles/primaryColor';
import { selectUser } from '../slices/mainSlice';
import { Ionicons } from '@expo/vector-icons';
import Fire from '../Fire';
import ChatMessage from '../components/ChatMessage';
import fetchDataWithoutAuth from '../general_functions/fetchDataWithoutToken';
import { MaterialIcons } from '@expo/vector-icons';

const ChatScreen = ({route}) => {
    const {convoId} = route.params;

    const convoMessagesRef = Fire.db().collection("conversations/"+convoId+"/messages")

    const dummy = useRef();

    const user = useSelector(selectUser);

    const [message, setMessage] = useState({
        text: "",
        sender_id: user._id,
    })

    const [chatMessages, setChatMessages] = useState([]);

    const [participants, setParticipants] = useState([]);

    const [participantDetails, setParticipantDetails] = useState([])

    const [participantsOpen, setParticipantsOpen] = useState(false);

    useEffect(()=>{

        convoMessagesRef.orderBy("timestamp")
        .onSnapshot((querySnapshot) => {
            var msgList = [];
            querySnapshot.forEach((doc) => {
                msgList.push({id: doc.id, ...doc.data()});
            });
            setChatMessages(msgList);
        });

        Fire.db().collection("/conversations").doc(convoId).get()
            .then((doc) => {
                if(doc.exists){
                    const data = doc.data()
                    setParticipants(data.participants)
                }
                else{
                    console.log("No such document!")
                }
            })
            .catch(error => {
                console.log("Oops, something went wrong!")
            })

    }, [])

    useEffect(() => {
        async function getParticipantDetails() {
            if(participants.length!=0){
                let fetchedDetails = []
                for(let i = 0; i < participants.length; i++){
                    if(participants[i] != user._id){
                        let res = await fetchDataWithoutAuth("/users/"+participants[i], "GET");
                        if(res?.data){
                            fetchedDetails.push(res.data);
                        }else{
                            alert(res.status)
                        }
                    }
                }
                setParticipantDetails(fetchedDetails);
            }
        }
        getParticipantDetails()
    }, [participants])

    const getSenderData = (senderId) => {
        for(let i = 0; i < participantDetails.length; i++){
            if(participantDetails[i]._id == senderId ) {
                return participantDetails[i];
            }
        }
        return undefined;
    }

    const handleMessageChange = (text, fieldName) => {
        setMessage(prev => {
            return {...prev, [fieldName]: text}
        })
    }

    const sendMessage = () => {
        convoMessagesRef.doc().set({
            text: message.text,
            sender: user._id,
            timestamp: Date.now()
        })

        setMessage(prev => {
            return {...prev, text: ""}
        })
    }

    return (
        <KeyboardAvoidingView style={{flex:1, backgroundColor:"white"}}>
            <View style={{backgroundColor: "white", elevation:5, paddingTop:40, paddingBottom:10}}>
                <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginRight:10}}>
                <Text style={{fontSize:20, fontWeight:"bold", color:lightBlack(), paddingLeft:10}}>CHAT</Text>
                <TouchableOpacity onPress={() => setParticipantsOpen(!participantsOpen)}>
                <MaterialIcons name={participantsOpen?"expand-less":"expand-more"} size={24} color="black" />
                </TouchableOpacity>
                </View>
                {(participantDetails.length != 0 && user && participantsOpen) && 
                <View style={{marginLeft: 10, marginRight: 10, alignItems:"center"}}>
                    {/*<Text style={{fontWeight:"bold", fontSize:12}}>PARTICIPANTS</Text>*/}
                    <FlatList 
                        data={[...participantDetails, user]}
                        keyExtractor = {(item) => item._id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({item, index}) => (
                            <View style={{position:"relative",  borderRadius: 17, left: -15 * index, alignItems:"center", justifyContent:"center", height: 34, width: 34, backgroundColor:"white"}}>
                                <Image 
                                    source={{uri: item.profile_picture}}
                                    style={{height: 30, width: 30, borderRadius: 15, resizeMode: "cover"}}
                                />
                            </View>
                        )}
                    />     
                </View>}
            </View>
            
            {participantDetails.length!=0 ? <FlatList
                ListHeaderComponent={
                    <View style={{alignItems:"center", justifyContent:"center", height: Dimensions.get("window").height}}>
                        <Image 
                            source={{uri: "https://bit.ly/3GJh076"}}
                            style={{height:100, width: 100, resizeMode: "contain"}}
                        />
                    </View>
                }
                inverted
                data={chatMessages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => (
                    <ChatMessage message={item} senderData={item.sender == user._id? user: getSenderData(item.sender)}/>
                )}
                contentContainerStyle={{flexDirection:"column-reverse"}}
            />: 
            <ActivityIndicator color={primaryColor()} />  
            
            }
            <View ref={dummy}></View>
            <View style={{position:"relative",bottom:0, backgroundColor:"white", flexDirection:"row", width:Dimensions.get("window").width, alignItems:"center", justifyContent:"space-between"}}>
            <TextInput placeholder="Enter message..." style={styles.msgInput} value={message.text} onChangeText={(text) => handleMessageChange(text, "text")}/>
            <TouchableOpacity style={{paddingVertical:10, paddingHorizontal:8, marginRight: 10}} disabled={message.text==""} onPress={() => sendMessage()}>
                <Ionicons name="paper-plane-outline" size={24} color={message.text==""?grayColor():primaryColor()} />
            </TouchableOpacity>
            </View>
            
        </KeyboardAvoidingView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    msgInput:{
        flex:0.91,
        paddingVertical: 10,
        fontSize:16,
        paddingHorizontal:8,
        color:lightBlack(),
    }

})
