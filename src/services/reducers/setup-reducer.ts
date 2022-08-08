import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
	showHotnessScale: boolean;
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
	showHotnessScale: false,
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
	},
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

export default setupReducer.reducer;
