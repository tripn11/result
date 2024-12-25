import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const studentsSlice = createSlice({
    name:'students',
    initialState,
    reducers:{
        setStudents(state,action) {
            state=[...action.payload]
        }
    }
})

export const {setStudents} = studentsSlice.actions;
export default studentsSlice.reducer;