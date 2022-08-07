// Parts of the code are taken from https://github.com/precondition/precondition.github.io

const ROW_LETTERS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnop";
const COL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijilmnopqrstuvwxyz";

const MAX_ROW = 52;
const MAX_COL = 52;

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
): IHeatMapData[] => {
	let layersAmount = 0;
	const keyFreq: Record<string, number[]> = {};

	for (let i = 1; i < data.length; i++) {
		const row = data[i][1] as number;
		const col = data[i][2] as number;
		const layer = data[i][3] as number;
		if (layer > layersAmount) layersAmount = layer;

		let rowcol = "";

		if (row < MAX_ROW && col < MAX_COL) {
			rowcol = ROW_LETTERS[row] + COL_LETTERS[col];
		} else {
			rowcol = "ØØ"; // 'Ø' is totally arbitrary
		}

		if (keyFreq[rowcol] === undefined) keyFreq[rowcol] = [];
		if (layer !== undefined) {
			keyFreq[rowcol][layer] = (keyFreq[rowcol][layer] || 0) + 1;
		}
	}

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

	const rowCols = matrixImageMapping.map((item) => item.keycode);

	const heatmapData: IHeatMapData[] = [];

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

			if (heatmapData[j] === undefined)
				heatmapData[j] = {
					maxKeyPresses: 0,
					dataPoints: [],
				};

			heatmapData[j].dataPoints.push({ x, y, value });
		}

		if (heatmapData[layersAmount + 1] === undefined)
			heatmapData[layersAmount + 1] = {
				maxKeyPresses: 0,
				dataPoints: [],
			};

		const { x, y } = matrixImageMapping.filter(
			(item) => item.keycode === rowcol
		)[0];

		heatmapData[layersAmount + 1].dataPoints.push({
			x,
			y,
			value: reduceSum(keyFreq[rowcol]),
		});
	}

	heatmapData.map(
		(item) =>
			(item.maxKeyPresses = Math.max(
				...item.dataPoints.map((dataPoint) => dataPoint.value)
			))
	);

	return heatmapData;
};
