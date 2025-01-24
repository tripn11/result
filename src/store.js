import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import schoolReducer from './reducers/schoolReducer';
import studentsReducer from './reducers/studentsReducer';

export default configureStore({
    reducer: {
        auth:authReducer,
        school:schoolReducer,
        students:studentsReducer
    }
})