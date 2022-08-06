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
	matrixImageMapping: IMatrixImageMapping[]
): Record<number, IHeatMapData> => {
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
	// console.log(keyFreq);

	const layerTotalKeyPresses = [];

	const keyPressOnLayer = Object.values(keyFreq);

	for (let i = 0; i <= layersAmount; i++) {
		layerTotalKeyPresses.push(
			Math.max(
				...keyPressOnLayer.map((pressesInLayer) => pressesInLayer[i] || 0)
			)
		);
	}

	layerTotalKeyPresses.push(
		Math.max(
			...keyPressOnLayer.map((pressesInLayer) => reduceSum(pressesInLayer))
		)
	);

	// console.log(layerTotalKeyPresses);

	// console.log(matrixToImage);
	const rowCols = matrixImageMapping.map((item) => item.keycode);
	// console.log(keyFreq);
	// console.log(rowCols);
	// (Object.keys(matrixToImage) as (keyof typeof matrixToImage)[]).find((key) => {
	// 	return matrixToImage[key] === "keyMatrix";
	// });
	// console.log(rowCols);

	// const heatMapData: Record<number, number[]> = {};

	const heatmapData: Record<number, { x: number; y: number; value: number }[]> =
		[];

	const rowcols = Object.keys(rowCols);
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

			const { x, y } = matrixImageMapping.filter(
				(item) => item.keycode === rowcol
			)[0];
			if (heatmapData[j] === undefined) heatmapData[j] = [];

			heatmapData[j].push({ x, y, value });
		}
		// console.log(data);

		// console.log(i);
		// console.log(coordsAndValue);
		// console.log(coordsAndValue);
		// coordsAndValue = totalKeypressesCount;
		// if (heatMapData[layersAmount + 1] == undefined) {
		// 	heatMapData[layersAmount + 1] = [];
		// }
		// heatMapData[layersAmount + 1].push(coordsAndValue);
	}
	const resultData: Record<number, IHeatMapData> = [];
	for (let i = 0; i <= layersAmount; i++) {
		if (resultData[i] == undefined) {
			resultData[i] = {
				maxKeyPresses: layerTotalKeyPresses[i],
				dataPoints: heatmapData[i],
			};
		}
	}
	const keys: number[] = Object.keys(resultData).map(Number);
	const allKeyPresses = keys.reduce((prevVal, currentValue, index) => {
		return (prevVal += resultData[index].maxKeyPresses);
	}, 0);
	console.log(allKeyPresses);
	// const allLayersPresses = reduceSum(keyFreq[rowcols]);
	// // console.log(keyFreq[rowcol]);
	// const coordsAndValue = { ...keyFreq[rowcols] };
	// if (resultData[layersAmount + 1] == undefined) {
	// 	resultData[layersAmount + 1] = {
	// 		maxKeyPresses: allLayersPresses,
	// 		dataPoints: coordsAndValue,
	// 	};
	// }

	// console.log(resultData);

	return resultData;
};
