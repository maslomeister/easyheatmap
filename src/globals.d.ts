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

interface IMatrixImageMapping {
	x: number;
	y: number;
	keycode: string;
}

interface IGradient {
	id: string;
	value: number;
	color: string;
}

interface IHeatmapSettings {
	radius: number;
	opacity: number;
	maxOpacity: number;
	currentLayer: number;
	gradient: IGradient[];
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

interface IScreenshotSettings {
	showHotnessScale: boolean;
}
