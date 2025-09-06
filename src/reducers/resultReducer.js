import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    results: [],
    classDetails: {
        title:'',
        teachersName: '',
        className: ''
    }
}

const resultSlice = createSlice({
    name:'results',
    initialState,
    reducers: {
        setResults(state, action) {
            state.results = action.payload;
        },
        setClassDetails(state, action) {
            state.classDetails = action.payload;
        },
        updateResult(state, action) {
            const { id, result } = action.payload;
            const index = state.results.findIndex(result => result.owner === id);
            if (index !== -1) {
                state.results[index]= result;
            }
        }
    }
})

export const { setResults, setClassDetails, updateResult } = resultSlice.actions;
export default resultSlice.reducer;