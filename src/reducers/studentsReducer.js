import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    totalStudentsInSchool:0,
    studentsInSection:[]
};

const studentsSlice = createSlice({
    name:'students',
    initialState,
    reducers:{
        setTotalStudentsInSchool(state, action) {
            if(action.payload==='add') {
                state.totalStudentsInSchool++;
            }else if(action.payload === 'subtract') {
                state.totalStudentsInSchool--;
            } else {
                state.totalStudentsInSchool = action.payload
            }
        },
        setStudentsInSection(state,action) {
            if(Array.isArray(action.payload)) {
                state.studentsInSection= action.payload  
            }else if(typeof action.payload === 'object') {
                state.studentsInSection.push(action.payload)
            }
        },
        editStudentInSection(state,action) {
            const studentIndex = state.studentsInSection.findIndex(each=>each._id===action.payload._id)
            state.studentsInSection.splice(studentIndex,1,action.payload)
        },
        removeStudentFromSection(state,action) {
            const studentIndex = state.studentsInSection.findIndex(each=>each._id===action.payload);
            state.studentsInSection.splice(studentIndex,1)
        }
    }
})

export const {setTotalStudentsInSchool,setStudentsInSection,editStudentInSection, removeStudentFromSection} = studentsSlice.actions;
export default studentsSlice.reducer;