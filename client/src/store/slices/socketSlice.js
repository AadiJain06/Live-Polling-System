import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  socket: null,
  isConnected: false,
  connectionError: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setConnectionError: (state, action) => {
      state.connectionError = action.payload;
    },
    clearConnectionError: (state) => {
      state.connectionError = null;
    },
  },
});

export const {
  setSocket,
  setConnected,
  setConnectionError,
  clearConnectionError,
} = socketSlice.actions;

export default socketSlice.reducer; 