import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  // configuring the slice
  name: 'ui',
  initialState: { cartIsVisible: false},
  reducers: {
    // actions
    toggle(state) {
      state.cartIsVisible = !state.cartIsVisible;
    },
    // showNotification(state, action) {
    //   state.notification = {
    //     status: action.payload.status,
    //     title: action.payload.title,
    //     message: action.payload.message,
    //   };
    // },
  },
});

// exporting the actions that can be use in the reducers
export const uiActions = uiSlice.actions;

// exporting the slice for the store
export default uiSlice;
