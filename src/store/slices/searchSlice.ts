import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: '',
  reducers: {
    setSearchString: (state, action) => {
      return action.payload;
    },
  },
});

export const { setSearchString } = searchSlice.actions;
export default searchSlice.reducer;
