import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:null
}

export const mainSlice = createSlice({
    name:"main",
    initialState,
    reducers:{
        setUser: (state, action) => {
            state.user = action.payload
        },
        
    }
})

export const {setUser} = mainSlice.actions;

//Selectors

export const selectUser = (state) => state.main.user;


export default mainSlice.reducer;