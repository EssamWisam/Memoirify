import { createSlice } from '@reduxjs/toolkit';

const editorCollection = createSlice({

  name: 'editorCollection',                   // 1. Specify the name

  initialState: {                           // 2. Define your state and initial values here

    showPage: false,

  },

  reducers: {                              // 3. Define functions that manipulate state

    setShowPage: (state, action) => {
      state.showPage = action.payload;
    },

  },

});                                         // 4. Export each state and needed functions


export const selectShowPage = (state) => state.editorCollection.showPage;

export const { setShowPage } = editorCollection.actions;

export default editorCollection.reducer;      // 5. Export the reducer to the store