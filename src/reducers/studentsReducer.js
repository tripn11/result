import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    totalStudents:0
};

const studentsSlice = createSlice({
    name:'students',
    initialState,
    reducers:{
        setTotalStudents(state,action) {
            state={totalStudents:action.payload}
        }
    }
})

export const {setTotalStudents} = studentsSlice.actions;
export default studentsSlice.reducer;