import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    theme: ""
}
const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        togolTheme: (state) => {
            state.theme = state.theme === "light" ? "dark" : "light";
        }
    }
})
export const { togolTheme } = themeSlice.actions
export default themeSlice.reducer