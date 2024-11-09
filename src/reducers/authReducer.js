import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    type:'',
    token:''
    
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