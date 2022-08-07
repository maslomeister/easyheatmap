interface ISize {
	width: number;
	height: number;
}

type ITextAreaSize = ISize;

interface ICurrentKey {
	keycode: string;
	x: number;
	y: number;
}

interface IKeyboardImage extends ISize {
	src: string;
}

// interface ICanvas {
// 	width: number;
// 	height: number;
// 	image: string;
// }

interface IMatrixImageMapping {
	x: number;
	y: number;
	keycode: string;
}

// interface IMatrixToImage {
// 	x: number;
// 	y: number;
// 	keyMatrix: string;
// 	[index: number]: [number, number];
// }
interface IHeatmapSettings {
	radius: number;
	opacity: number;
	maxOpacity: number;
	currentLayer: number;
	gradient: Record<number, string>;
	layerNames?: string[];
}
interface IConfig {
	matrixImageMapping: IMatrixImageMapping[];
	keyboardImage: IKeyboardImage;
	heatmapSettings?: IHeatmapSettings;
}

interface IDataPoints {
	x: number;
	y: number;
	value: number;
}

interface IHeatMapData {
	maxKeyPresses: number;
	dataPoints: IDataPoints[];
}

// interface IHeatmapConfig {
// 	radius?: number;
// 	width?: number;
// 	height?: number;
// 	gradient?: Record<number, string>;
// 	blur?: number;
// 	backgroundColor?: string;
// 	opacity?: number;
// 	maxOpacity?: number;
// 	minOpacity?: number;
// 	useGradientOpacity?: boolean;
// }

// interface IHeatmapConfig {
// 	radius: number;
// 	gradient: Record<number, string>;
// 	blur: number;
// 	maxOpacity: number;
// 	useGradientOpacity: boolean;
// }

// interface IHeatmapConfigContainer extends IHeatmapConfig {
// 	container?: HTMLDivElement;
// }
