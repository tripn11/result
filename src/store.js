import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import schoolReducer from './reducers/schoolReducer';

export default configureStore({
    reducer: {
        auth:authReducer,
        school:schoolReducer
    }
})