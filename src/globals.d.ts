interface ITextAreaSize {
	width: number;
	height: number;
}

interface ICanvas {
	width: number;
	height: number;
	image: string;
}

interface IMatrixToScreenTable {
	x: number;
	y: number;
	keyMatrix: string;
	[index: number]: [number, number];
}
