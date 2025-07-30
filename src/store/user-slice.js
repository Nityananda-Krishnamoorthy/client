import { createSlice } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";


const userSlice = createSlice({
    name: 'user',
    initialState: {currentUser: JSON.parse(localStorage.getItem("currentUser"))|| null,
        socket: null, onlineUsers:[]},
        reducers: {
           changeCurrentUser: (state, action) => {
            const updatedUser = action.payload;

            if (!updatedUser) {
                state.currentUser = null;
                localStorage.removeItem("currentUser");
                return;
            }

            if (!updatedUser.token && state.currentUser?.token) {
                updatedUser.token = state.currentUser.token;
            }

            state.currentUser = updatedUser;
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            },


            setSocket: (state, action) => {
                state.socket = action.payload;
            },
            setOnlineUsers: (state, action) =>{
                state.onlineUsers = action.payload;
            },
        }
})


export const userActions = userSlice.actions;

export default userSlice;