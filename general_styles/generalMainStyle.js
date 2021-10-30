import { StyleSheet } from "react-native"
import grayColor from "./grayColor";
import primaryColor from "./primaryColor";

const generalMainStyle = StyleSheet.create({
    row: {
        flexDirection:"row",
        alignItems:"center",
    },
    topMarginAndFlex: {
        flex:1,
        paddingTop:50,
        backgroundColor:"white"
    },
    inputStyle:{
        margin:10,
        paddingVertical:8,
        paddingHorizontal:8,
        fontSize:17,
        color:"rgb(32,32,32)",
        borderWidth:1,
        borderRadius:5,
        borderColor:grayColor()
    },
    solidButton:{
        padding:8,
        backgroundColor:primaryColor(),
        color:"white",
        margin:10,
        borderRadius:3,
        borderColor:grayColor(),
        borderWidth:0.5,
    }
})

export default generalMainStyle;