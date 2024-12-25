import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    type:'',
    token:'',
    basicsIsModified:false,
    classesIsModified:false
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers: {
        setAuthState(state,action) {
            Object.assign(state,action.payload)
        },
        logout() {
            return initialState
        }
    }
})

export const { setAuthState,logout } = authSlice.actions;
export default authSlice.reducer;