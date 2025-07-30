import { createSlice } from "@reduxjs/toolkit";


const initialState ={
    themeModalIsOpen: false, 
    editProfileModelOpen: false, 
    editPostModalOpen: false,
    editPostId: "", 
    theme: JSON.parse(localStorage.getItem("theme")) || {primaryColor: "", backgroundColor: ""}
}




const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        openThemeModal: state => {
            state.themeModalIsOpen = true;
        },
        closeThemeModal: state => {
            state.themeModalIsOpen = false;
        },
        changeTheme: (state, action) => {
            state.theme = action.payload;
        },
        openEditProfileModal: state => {
            state.editProfileModelOpen = true;
        },
        closeEditProfileModal: state => {
            state.editProfileModelOpen = false;
        },
        openEditPostModal: (state,action) => {
            state.editPostModalOpen = true;
            state.editPostId = action.payload
        },
        closeEditPostModal: state => {
            state.editPostModalOpen = false;
        },
    }
})


export const uiSliceAction = uiSlice.actions;

export default uiSlice;