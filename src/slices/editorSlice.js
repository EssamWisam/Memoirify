import { createSlice } from '@reduxjs/toolkit';

const editorCollection = createSlice({

  name: 'editorCollection',                   // 1. Specify the name

  initialState: {                           // 2. Define your state and initial values here

    showPage: false,
    fileContent: null,
    isNewFile: false
  },

  reducers: {                              // 3. Define functions that manipulate state

    SetShowPage: (state, action) => {
      state.showPage = action.payload;
    },
    SetFileContent: (state, action) => {
      state.fileContent = action.payload;
    },
    SetIsNewFile: (state, action) => {
      state.isNewFile = action.payload;
    }

  },

});                                         // 4. Export each state and needed functions


export const selectShowPage = (state) => state.editorCollection.showPage;
export const selectFileContent = (state) => state.editorCollection.fileContent;
export const selectIsNewFile = (state) => state.editorCollection.isNewFile;

export const { SetShowPage } = editorCollection.actions;
export const { SetFileContent } = editorCollection.actions;
export const { SetIsNewFile } = editorCollection.actions;



export default editorCollection.reducer;      // 5. Export the reducer to the store