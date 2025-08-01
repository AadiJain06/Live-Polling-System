import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
  connectionError: null,
  socketId: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setSocketId: (state, action) => {
      state.socketId = action.payload;
    },
    setConnectionError: (state, action) => {
      state.connectionError = action.payload;
    },
    clearConnectionError: (state) => {
      state.connectionError = null;
    },
    clearSocket: (state) => {
      state.isConnected = false;
      state.socketId = null;
      state.connectionError = null;
    },
  },
});

export const {
  setConnected,
  setSocketId,
  setConnectionError,
  clearConnectionError,
  clearSocket,
} = socketSlice.actions;

export default socketSlice.reducer; 