import firebase from "firebase"
import { LogBox } from "react-native";

class Fire{
    constructor(){
        this.init()
    }

    init(){
        LogBox.ignoreLogs([`Setting a timer for a long period`]);
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
    }

    db(){
        return firebase.firestore()
    }
}

export default new Fire();

