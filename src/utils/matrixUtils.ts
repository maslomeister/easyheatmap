// Parts of the code are taken from https://github.com/precondition/precondition.github.io

const ROW_LETTERS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnop";
const COL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijilmnopqrstuvwxyz";

const MAX_ROW = 52;
const MAX_COL = 52;
// let hasKeyCodes = true;

const helperStartPattern = new RegExp(`┌──┐`, "g");
const helperEndPattern = new RegExp(`└──┘`, "g");
const rowcolPattern = new RegExp(`\\b[${ROW_LETTERS}][${COL_LETTERS}]\\b`, "g");

function reduceSum(array: number[]) {
	return array.reduce((a: number, b: number) => a + b, 0);
}

export const getMatrixKeys = (matrix: string) => {
	const startMatch = matrix.match(helperStartPattern);
	const endMatch = matrix.match(helperEndPattern);

	if (startMatch && endMatch) {
		return {
			allowed: true,
			matrix: matrix.match(rowcolPattern) as Array<string>,
		};
	}
	return { allowed: false, matrix: [""] };
};

export const processCsv = (
	data: (string | number)[][],
	matrixToImage: IMatrixToImage[]
) => {
	let layersAmount = 0;
	const keyFreq: Record<string, number[]> = {};
	// const keyCode = data[0][0];
	// if (typeof keyCode !== "string") hasKeyCodes = false;

	// if (hasKeyCodes) {
	// 	for (let i = 1; i < data.length; i++) {
	// 		const keycode = data[i][0];
	// 		const row = data[i][1] as number;
	// 		const col = data[i][2] as number;
	// 		const layer = data[i][3] as number;
	// 		// console.log(layer);
	// 		let rowcol = "";

	// 		if (row < MAX_ROW && col < MAX_COL) {
	// 			rowcol = ROW_LETTERS[row] + COL_LETTERS[col];
	// 		} else {
	// 			// Is probably a combo whose row, col = 254, 254
	// 			rowcol = "ØØ"; // 'Ø' is totally arbitrary
	// 		}

	// 		// keyFreq[rowcol] = [0];
	// 		if (keyFreq[rowcol] === undefined) keyFreq[rowcol] = [];
	// 		if (layer !== undefined) {
	// 			keyFreq[rowcol][layer] = (keyFreq[rowcol][layer] || 0) + 1;
	// 		}

	// 		// keyFreq[rowcol][layer] = (keyFreq[rowcol][layer] || 0) + 1;
	// 	}
	// 	console.log(keyFreq);
	// } else {
	// 	console.log("no keycodes");
	// }

	for (let i = 1; i < data.length; i++) {
		// const keycode = data[i][0];
		const row = data[i][1] as number;
		const col = data[i][2] as number;
		const layer = data[i][3] as number;
		if (layer > layersAmount) layersAmount = layer;
		// console.log(layer);
		let rowcol = "";

		if (row < MAX_ROW && col < MAX_COL) {
			rowcol = ROW_LETTERS[row] + COL_LETTERS[col];
		} else {
			// Is probably a combo whose row, col = 254, 254
			rowcol = "ØØ"; // 'Ø' is totally arbitrary
		}

		// keyFreq[rowcol] = [0];
		if (keyFreq[rowcol] === undefined) keyFreq[rowcol] = [];
		if (layer !== undefined) {
			keyFreq[rowcol][layer] = (keyFreq[rowcol][layer] || 0) + 1;
		}

		// keyFreq[rowcol][layer] = (keyFreq[rowcol][layer] || 0) + 1;
	}
	console.log(keyFreq);

	const keyPressesTotal = [];

	const keyPressOnLayer = Object.values(keyFreq);

	for (let i = 0; i <= layersAmount; i++) {
		keyPressesTotal.push(
			Math.max(
				...keyPressOnLayer.map((pressesInLayer) => pressesInLayer[i] || 0)
			)
		);
	}

	keyPressesTotal.push(
		Math.max(
			...keyPressOnLayer.map((pressesInLayer) => reduceSum(pressesInLayer))
		)
	);

	// console.log(keyPressesTotal);

	// console.log(matrixToImage);
	const rowCols = matrixToImage.map((item) => item.keyMatrix);
	// console.log(keyFreq);
	// console.log(rowCols);
	// (Object.keys(matrixToImage) as (keyof typeof matrixToImage)[]).find((key) => {
	// 	return matrixToImage[key] === "keyMatrix";
	// });
	// console.log(rowCols);

	// const heatMapData: Record<number, number[]> = {};

	const heatmapData: Record<number, { x: number; y: number; value: number }[]> =
		[];

	let i = rowCols.length;
	while (i--) {
		const rowcol = rowCols[i];

		if (keyFreq[rowcol] == undefined) {
			continue;
		}
		for (let j = 0; j <= layersAmount; j++) {
			const value = keyFreq[rowcol][j];

			if (value == undefined) {
				continue;
			}

			const { x, y } = matrixToImage.filter(
				(item) => item.keyMatrix === rowcol
			)[0];
			if (heatmapData[j] === undefined) heatmapData[j] = [];

			heatmapData[j].push({ x, y, value });
		}
		// console.log(data);

		// const totalKeypressesCount = reduceSum(keyFreq[rowcol]);
		// console.log(keyFreq[rowcol]);
		// const coordsAndValue = { ...keyFreq[rowcol] };
		// console.log(coordsAndValue);
		// console.log(coordsAndValue);
		// coordsAndValue = totalKeypressesCount;
		// if (heatMapData[layersAmount + 1] == undefined) {
		// 	heatMapData[layersAmount + 1] = [];
		// }
		// heatMapData[layersAmount + 1].push(coordsAndValue);
	}

	return heatmapData;
};
