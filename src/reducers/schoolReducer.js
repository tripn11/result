import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name:'',
    email:'',
    password:'',
    phoneNumber:'',
    address:'',
    motto:'',
    classes:{
        nursery:{
            classes:[],
            grading:[],
            subjects:[]
        },
        primary:{
            classes:[],
            grading:[],
            subjects:[]
        },
        juniorSecondary:{
            classes:[],
            grading:[],
            subjects:[]
        },
        seniorSecondary:{
            classes:[],
            grading:[],
            subjects:[]
        }
    },
    termInfo:{
        totalTimesSchoolOpened:0,
        currentSession:'',
        currentTerm:''
    },
    tokens:[]
}

const schoolSlice = createSlice({
    name:'school',
    initialState,
    reducers: {
        setInitialSchool(state, action) {
            Object.assign(state, action.payload)
        },
        setBasics(state,action) {
            Object.assign(state, action.payload)
        },
        setClasses(state,action) {
            const {section,category, update} = action.payload
            const updatedSection = state.classes[section]
            updatedSection[category] = [...update]
        }
    }
})

export const {setInitialSchool, setBasics, setClasses} = schoolSlice.actions;
export default schoolSlice.reducer;