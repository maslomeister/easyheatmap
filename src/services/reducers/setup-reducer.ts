import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../store";

import {
	DEFAULT_RADIUS,
	DEFAULT_OPACITY,
	DEFAULT_MAX_OPACITY,
	DEFAULT_CURRENT_LAYER,
	DEFAULT_GRADIENT,
} from "@/constants/constants";

export interface IAppState {
	matrixArray: string[];
	nextKey: string;
	currentKey: ICurrentKey;
	textRepresentation: string;
	textAreaSize: ITextAreaSize;
	setupState: string;
	keyboardImage: IKeyboardImage;
	matrixImageMapping: IMatrixImageMapping[];
	heatmapSettings: IHeatmapSettings;
	heatmapData: IHeatMapData[];
}

const initialState: IAppState = {
	matrixArray: [],
	nextKey: "",
	currentKey: { keycode: "", x: 0, y: 0 },
	textRepresentation: "",
	textAreaSize: { width: 0, height: 0 },
	setupState: "textMatrixUpload",
	keyboardImage: {
		src: "",
		width: 0,
		height: 0,
	},
	matrixImageMapping: [],
	heatmapSettings: {
		radius: DEFAULT_RADIUS,
		opacity: DEFAULT_OPACITY,
		currentLayer: DEFAULT_CURRENT_LAYER,
		maxOpacity: DEFAULT_MAX_OPACITY,
		gradient: DEFAULT_GRADIENT,
	},
	heatmapData: [],
};

export const setupReducer = createSlice({
	name: "setup",
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setCurrentKey: (state, key: PayloadAction<ICurrentKey>) => {
			state.currentKey = key.payload;
		},
		setNextKey: (state, key: PayloadAction<string>) => {
			state.nextKey = key.payload;
		},
		setMatrixArray: (state, matrixArray: PayloadAction<string[]>) => {
			return (state = {
				...state,
				matrixArray: matrixArray.payload,
				nextKey: matrixArray.payload[0],
			});
		},
		shiftMatrixArray: (state) => {
			const matItem = state.matrixArray[0];
			const filteredMatrixArray = state.matrixArray.filter(
				(item) => item !== matItem
			);
			const nextKey = filteredMatrixArray.slice(0, 1)[0];
			return (state = {
				...state,
				matrixArray: filteredMatrixArray,
				nextKey: nextKey ?? "",
			});
		},
		setTextRepresentation: (
			state,
			textRepresentation: PayloadAction<string>
		) => {
			state.textRepresentation = textRepresentation.payload;
		},
		setTextAreaSize: (state, textAreaSize: PayloadAction<ITextAreaSize>) => {
			state.textAreaSize = textAreaSize.payload;
		},
		setSetupState: (state, setupState: PayloadAction<string>) => {
			state.setupState = setupState.payload;
		},
		setMatrixImageMapping: (
			state,
			matrixImageMapping: PayloadAction<IMatrixImageMapping[]>
		) => {
			state.matrixImageMapping = matrixImageMapping.payload;
		},
		setKeyboardImage: (state, keyboardImage: PayloadAction<IKeyboardImage>) => {
			state.keyboardImage = keyboardImage.payload;
		},
		updateHeatmapSettings: (
			state,
			heatmapSettings: PayloadAction<IHeatmapSettings>
		) => {
			return (state = {
				...state,
				heatmapSettings: heatmapSettings.payload,
			});
		},
		moveCurrentKeyUp: (state, currentKey: PayloadAction<ICurrentKey>) => {
			return (state = {
				...state,
				currentKey: { ...state.currentKey, y: currentKey.payload.y - 1 },
				matrixImageMapping: state.matrixImageMapping.map((item) => {
					if (item.keycode === currentKey.payload.keycode) {
						return {
							keycode: item.keycode,
							x: item.x,
							y: item.y - 1,
						};
					}
					return item;
				}),
			});
		},
		setHeatmapData: (state, heatmapData: PayloadAction<IHeatMapData[]>) => {
			state.heatmapData = heatmapData.payload;
		},
		moveCurrentKeyDown: (state, currentKey: PayloadAction<ICurrentKey>) => {
			return (state = {
				...state,
				currentKey: { ...state.currentKey, y: currentKey.payload.y + 1 },
				matrixImageMapping: state.matrixImageMapping.map((item) => {
					if (item.keycode === currentKey.payload.keycode) {
						return {
							keycode: item.keycode,
							x: item.x,
							y: item.y + 1,
						};
					}
					return item;
				}),
			});
		},
		moveCurrentKeyLeft: (state, currentKey: PayloadAction<ICurrentKey>) => {
			return (state = {
				...state,
				currentKey: { ...state.currentKey, x: currentKey.payload.x - 1 },
				matrixImageMapping: state.matrixImageMapping.map((item) => {
					if (item.keycode === currentKey.payload.keycode) {
						return {
							keycode: item.keycode,
							x: item.x - 1,
							y: item.y,
						};
					}
					return item;
				}),
			});
		},
		moveCurrentKeyRight: (state, currentKey: PayloadAction<ICurrentKey>) => {
			return (state = {
				...state,
				currentKey: { ...state.currentKey, x: currentKey.payload.x + 1 },
				matrixImageMapping: state.matrixImageMapping.map((item) => {
					if (item.keycode === currentKey.payload.keycode) {
						return {
							keycode: item.keycode,
							x: item.x + 1,
							y: item.y,
						};
					}
					return item;
				}),
			});
		},
		// increment: (state) => {
		// 	// Redux Toolkit allows us to write "mutating" logic in reducers. It
		// 	// doesn't actually mutate the state because it uses the Immer library,
		// 	// which detects changes to a "draft state" and produces a brand new
		// 	// immutable state based off those changes
		// 	state.value += 1;
		// },
		// decrement: (state) => {
		// 	state.value -= 1;
		// },
		// // Use the PayloadAction type to declare the contents of `action.payload`
		// incrementByAmount: (state, action: PayloadAction<number>) => {
		// 	state.value += action.payload;
		// },
	},
	// The `extraReducers` field lets the slice handle actions defined elsewhere,
	// including actions generated by createAsyncThunk or in other slices.
	// extraReducers: (builder) => {
	// 	builder
	// 		.addCase(incrementAsync.pending, (state) => {
	// 			state.status = "loading";
	// 		})
	// 		.addCase(incrementAsync.fulfilled, (state, action) => {
	// 			state.status = "idle";
	// 			state.value += action.payload;
	// 		})
	// 		.addCase(incrementAsync.rejected, (state) => {
	// 			state.status = "failed";
	// 		});
	// },
});

export const {
	setCurrentKey,
	setNextKey,
	setMatrixArray,
	setTextRepresentation,
	setTextAreaSize,
	setSetupState,
	setKeyboardImage,
	setMatrixImageMapping,
	shiftMatrixArray,
	moveCurrentKeyUp,
	moveCurrentKeyDown,
	moveCurrentKeyLeft,
	moveCurrentKeyRight,
	updateHeatmapSettings,
	setHeatmapData,
} = setupReducer.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state: RootState) => state.app.value;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export default setupReducer.reducer;
