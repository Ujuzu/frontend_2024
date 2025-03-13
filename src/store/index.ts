import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { configureStore, combineSlices } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import { appSlice } from './reducers/appReducer';
import { setupListeners } from '@reduxjs/toolkit/query';

const rootReducer = combineSlices({
  appStore: appSlice.reducer,
  api: apiSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,

    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat([apiSlice.middleware]);
    },
    preloadedState,
  });

  setupListeners(store.dispatch);
  return store;
};

export const store = makeStore();

export type AppStore = typeof store;

export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
