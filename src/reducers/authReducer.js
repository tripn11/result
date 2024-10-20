import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    auth:false,
    code:'',
    type:''
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers: {
        setAuthState(state,action) {
            Object.assign(state,action.payload)
        }
    }
})

export const { setAuthState } = authSlice.actions;
export default authSlice.reducer;