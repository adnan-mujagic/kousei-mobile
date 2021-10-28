import React, { useState } from 'react'
import { ActivityIndicator, Alert, Image, LogBox, StyleSheet, Switch, Text, TextInput, ToastAndroid, View } from 'react-native'
import grayColor from '../general_styles/grayColor'
import { Ionicons } from '@expo/vector-icons'; 
import { TouchableOpacity } from 'react-native-gesture-handler';
import lightBlack from '../general_functions/lightBlack';
import primaryColor from '../general_styles/primaryColor';
import * as ImagePicker from 'expo-image-picker';
import firebase from  "firebase"; 
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, selectUser, setPosts } from '../slices/mainSlice';
import randomString from '../general_functions/randomString';
import checkForEmptyFields from '../general_functions/checkForEmptyFields';
import fetchDataWithAuth from '../general_functions/fetchDataWithAuth';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CreatePost = () => {

    const user = useSelector(selectUser);

    const token = useSelector(selectToken)

    const dispatch = useDispatch();

    const [postDetails, setPostDetails] = useState({
        caption:"",
        comments_enabled: true
    })

    const [expanded, setExpanded] = useState(false)

    const [uploading, setUploading] = useState(false);

    const [image, setImage] = useState(null)

    const pickImage = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
            else{
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    aspect:[1,1],
                    allowsEditing:true,
                    quality:1,
                    allowsMultipleSelection:true,
                })

                console.log(result);
                
                if(!result.cancelled){
                    setImage(result.uri);
                }
            }
        }
        
    }

    const takePicture = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
            else{
                let result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    aspect:[1,1],
                    allowsEditing:true,
                    quality:1,
                    allowsMultipleSelection:true,
                })

                console.log(result);
                
                if(!result.cancelled){
                    setImage(result.uri);
                }
            }
        }
        
    }

    const post = async () => {
        if(checkForEmptyFields(postDetails, ["comments_enabled"])){
            Alert.alert("Warning", "You must enter something as a caption!");
            return;
        }
        else{
            setUploading(true);
            let dwnldLink = "";
            if(image){
                dwnldLink = await uploadImageAsync(image);
            }
            const res = await fetchDataWithAuth("/users/" + user._id + "/posts", "POST", {...postDetails, image: dwnldLink}, token);
            ToastAndroid.show(res.status, ToastAndroid.SHORT)
            const posts = await fetchDataWithAuth("/posts?order=normal", "GET", undefined, token)
            if(posts?.data){
                dispatch(setPosts(posts.data));
            }
            setImage(null);
            setPostDetails({
                caption: "",
                comments_enabled:true
            })
            setExpanded(false);
            setUploading(false);
        }
        
    }

    async function uploadImageAsync(uri) {
        const firebaseConfig = {
            apiKey: "AIzaSyBLKo8OqjZQfIlyLFTgVr2lpIUKxtyL6Sk",
            authDomain: "kousei-1b762.firebaseapp.com",
            projectId: "kousei-1b762",
            storageBucket: "gs://kousei-1b762.appspot.com/",
            messagingSenderId: "725941720412",
            appId: "1:725941720412:web:46ea35b463568693971d99",
            measurementId: "G-27KRCSLP4L"
        };

        if(!firebase.apps.length){
            firebase.initializeApp(firebaseConfig)
        }

        const response = await fetch(uri);

        const blob = await response.blob();
      
        const ref = firebase.storage().ref().child("images/" + user._id + "/" +  randomString(8))
        
        const snapshot = await ref.put(blob);

        blob.close();
      
        return await snapshot.ref.getDownloadURL();
    }

    LogBox.ignoreLogs([`Setting a timer for a long period`]);

    return (
        <View style={{padding:10, borderBottomWidth:0.2, borderColor:grayColor()}}>
            {!expanded ?
                <View>
                <TouchableOpacity  style={{flexDirection:"row", alignItems:"center"}} onPress={()=> setExpanded(!expanded)}>
                    <MaterialCommunityIcons name="plus-box-outline" size={24} color={lightBlack()} />
                    <Text style={{fontSize:16, color:lightBlack()}}>Create a Post</Text>
                </TouchableOpacity>
                </View> 
            :
            <View>
                <TouchableOpacity style={{flexDirection:"row", alignItems:"center"}} onPress={()=>setExpanded(!expanded)}>
                    <MaterialCommunityIcons name="plus-box-outline" size={24} color={lightBlack()} />
                    <Text style={{color: lightBlack(), fontSize:16}}>Create a Post</Text>
                </TouchableOpacity>
                <View>
                    <Image 
                        style={{height:24, width: 24, borderRadius: 12, borderWidth:0.2, borderColor: grayColor(), marginTop:10}}
                        source={{uri: user.profile_picture}}
                    />
                    <TextInput 
                        value={postDetails.caption} 
                        onChangeText={(text) => setPostDetails(prevDetails => {
                            return {...prevDetails, caption: text}
                        })} 
                        style={{paddingVertical:10}} 
                        placeholder="What is on your mind..."
                    />
                </View>
                <View style={{flexDirection:"row", marginBottom:10, alignItems:"center", justifyContent:"space-between"}}>
                <Text>Enable Comments?</Text>
                <Switch
                    style={{marginRight:-2}}
                    value={postDetails.comments_enabled}
                    onValueChange={()=>setPostDetails(prevDetails => {return {...prevDetails, comments_enabled: !prevDetails.comments_enabled}})}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={postDetails.comments_enabled?primaryColor(): grayColor()}
                    
                />
                </View>
                {image && <Image source={{uri:image}} style={{height:100, width:100, borderRadius:5, resizeMode:"cover"}}/>}
                <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <TouchableOpacity style={{marginRight:10}} onPress={()=>takePicture()}>
                            <Ionicons name="camera-outline" size={25.5} color={primaryColor()} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>pickImage()}>
                            <Ionicons name="image-outline" size={24} color={primaryColor()} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity disabled={uploading} onPress={()=>post()} style={{paddingHorizontal:10, borderRadius:5, color:"white", paddingVertical:5,backgroundColor: uploading? "rgb(240,240,240)": primaryColor()}}>
                            <Text style={{color:"white", fontSize:16}}>Post</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {uploading && <ActivityIndicator color={primaryColor()} />}
            
            </View>
        }
            
        </View>
    )
}

export default CreatePost

const styles = StyleSheet.create({})
