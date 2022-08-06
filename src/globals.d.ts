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
	[index: number]: [number, number];
}

// interface IMatrixToImage {
// 	x: number;
// 	y: number;
// 	keyMatrix: string;
// 	[index: number]: [number, number];
// }

interface IConfig {
	matrixImageMapping: IMatrixImageMapping[];
	keyboardImage: IKeyboardImage;
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

interface IHeatmapConfig {
	container?: HTMLElement;
	canvas?: HTMLCanvasElement;
	shadowCanvas?: HTMLCanvasElement;
	radius?: number;
	width?: number;
	height?: number;
	gradient?: Record<number, string>;
	blur?: number;
	backgroundColor?: string;
	opacity?: number;
	maxOpacity?: number;
	minOpacity?: number;
	useGradientOpacity?: boolean;
}
