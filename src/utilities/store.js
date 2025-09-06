import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';
import { combineReducers } from 'redux';
import authReducer from '../reducers/authReducer';
import schoolReducer from '../reducers/schoolReducer';
import studentsReducer from '../reducers/studentsReducer';
import resultReducer from '../reducers/resultReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    school: schoolReducer,
    students: studentsReducer,
    results: resultReducer
});

const persistConfig = {
    key: 'root',
    storage: storageSession,
    whitelist: ['auth', 'school', 'students', 'results']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer
});

export const persistor = persistStore(store);