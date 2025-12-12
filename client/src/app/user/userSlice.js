import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
            state.error = null
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },
        signInFaluer: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        updateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            // تحديث بيانات المستخدم الحالية بالبيانات الجديدة (الصورة)
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // ------------------------------------
        // 🆕 دالة تسجيل الخروج (Sign Out)
        // ------------------------------------
        signOutUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        }
    }
})
export const { signInStart,
    signInFaluer,
    signInSuccess,
    updateStart,
    updateSuccess,
    updateFailure, } = userSlice.actions
export default userSlice.reducer;