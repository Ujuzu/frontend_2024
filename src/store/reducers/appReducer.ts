/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  state: string;
}

const initialAppState: AppState = {
  state: '',
};

type UpdateStorePayload = {
  key: keyof AppState;
  value: any;
};

export const appSlice = createSlice({
  name: 'appStore',
  initialState: initialAppState,
  reducers: {
    updateStore(state, action: PayloadAction<UpdateStorePayload>) {
      const { key, value } = action.payload;
      state[key] = value;
    },
  },
});

export const { updateStore } = appSlice.actions;
export default appSlice.reducer;
