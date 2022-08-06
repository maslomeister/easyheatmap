import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import setupReducer from "./reducers/setup-reducer";

export const store = configureStore({
	reducer: {
		setup: setupReducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
