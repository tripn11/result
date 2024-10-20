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
        totalTimesSchoolOpened:'',
        currentSession:'',
        currentTerm:''
    },
    tokens:[]
}

const schoolSlice = createSlice({
    name:'school',
    initialState,
    reducers: {
        setBasics(state,action) {
            Object.assign(state,action.payload)
        }
        // setClasses(state,action) {

        // }
    }
})

export const { setBasics } = schoolSlice.actions;
export default schoolSlice.reducer;