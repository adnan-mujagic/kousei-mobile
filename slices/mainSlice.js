import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:null,
    token:null,
    requestedUser: null,
    requestedPost: null,
    mappedUsers:null,
    posts: []
}

export const mainSlice = createSlice({
    name:"main",
    initialState,
    reducers:{
        setUser: (state, action) => {
            state.user = action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload
        },
        setRequestedUser: (state, action) => {
            state.requestedUser = action.payload
        },
        setRequestedPost: (state, action) => {
            state.requestedPost = action.payload
        },
        setMappedUsers: (state, action) => {
            state.mappedUsers = action.payload;
        },
        setPosts: (state, action) => {
            state.posts = action.payload;
        }
    }
})

export const {setUser, setToken, setRequestedPost, setRequestedUser, setMappedUsers, setPosts} = mainSlice.actions;

//Selectors

export const selectUser = (state) => state.main.user;
export const selectToken = (state) => state.main.token;
export const selectRequestedUser = (state) => state.main.requestedUser;
export const selectRequestedPost = (state) => state.main.requestedPost;
export const selectMappedUsers = (state) => state.main.mappedUsers;
export const selectPosts = (state) => state.main.posts;


export default mainSlice.reducer;