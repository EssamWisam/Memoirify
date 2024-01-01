import { configureStore } from '@reduxjs/toolkit';
import editorReducer from './editorSlice';


const store = configureStore({
    reducer: {
        editorCollection: editorReducer
    },
});

export default store;