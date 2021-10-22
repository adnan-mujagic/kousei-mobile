import AsyncStorage from "@react-native-async-storage/async-storage";

const storeTokenToAsync = async (value) => {
    try {
        await AsyncStorage.setItem('token', value)
    } catch (e) {
        // saving error
        console.log(e.message);
    }
}

export default storeTokenToAsync;