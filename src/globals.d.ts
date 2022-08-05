interface ITextAreaSize {
	width: number;
	height: number;
}

interface ICanvas {
	width: number;
	height: number;
	image: string;
}

interface IMatrixToImage {
	x: number;
	y: number;
	keyMatrix: string;
	[index: number]: [number, number];
}

interface IConfig {
	matrixToImage: IMatrixToImage[];
	image: ICanvas;
}
