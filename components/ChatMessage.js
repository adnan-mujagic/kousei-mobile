import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import lightBlack from '../general_functions/lightBlack'
import prettyDate from '../general_functions/prettyDate'
import grayColor from '../general_styles/grayColor'
import primaryColor from '../general_styles/primaryColor'
import { selectUser } from '../slices/mainSlice'

const ChatMessage = ({message, senderData}) => {
    const user = useSelector(selectUser)

    return (
        <View style={{flexDirection:"row", justifyContent:message.sender == user._id ? "flex-end" : "flex-start", margin: 5}}>
            
            <View>
            {/*<Text style={{fontSize:8}}>{prettyDate(message.timestamp)}</Text>*/}
            {senderData?._id != user._id && 
                <View style={{margin:5, marginLeft:0, flexDirection:"row", alignItems:"center"}}>
                <Image 
                    source={{uri: senderData.profile_picture}}
                    style={{height:20, width:20, borderRadius: 10, marginRight:5, resizeMode: "cover", borderColor:grayColor(), borderWidth: StyleSheet.hairlineWidth}}
                /> 
                <Text style={{color:"rgb(100,100,100)", fontSize:12}}>{senderData.username}</Text>
                
                </View>
            }
            <View style={{maxWidth:Dimensions.get("window").width*0.7, padding:10, backgroundColor: message.sender == user._id ? primaryColor() : "white", borderWidth: StyleSheet.hairlineWidth, borderColor: message.sender != user._id ? grayColor() : "white", borderRadius: 16}}>
                <Text style={{color: user._id == message.sender ? "white" : lightBlack(), fontSize:16}}>{message.text}</Text>
                
            </View>
            </View>
        </View>
    )
}

export default ChatMessage

const styles = StyleSheet.create({})
