import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    type:'',
    token:'',
    basicsIsModified:false,
    classesIsModified:false,
    modifiedClassNames:[],
    schools:[] //for owner only
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
        },
        setModifiedClassNames(state, action) {
            if(action.payload===undefined) {
                state.modifiedClassNames = []
            }else {
                const index = state.modifiedClassNames.findIndex(each => each.newName === action.payload.formerName)
                if(index===-1) {
                    state.modifiedClassNames.push(action.payload)
                }else {
                    if(state.modifiedClassNames[index].formerName === action.payload.newName) {
                        state.modifiedClassNames.splice(index,1)
                    }else {
                        state.modifiedClassNames.splice(index,1,{
                            formerName:state.modifiedClassNames[index].formerName,
                            newName:action.payload.newName
                        })
                    }

                }
            }   
        }
    }
})

export const { setAuthState,logout,setModifiedClassNames } = authSlice.actions;
export default authSlice.reducer;