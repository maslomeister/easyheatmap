import { v4 as uuidv4 } from "uuid";

function round(value: number, precision: number) {
	const multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
}

const insert = (arr: IGradient[], index: number, newItem: IGradient) => [
	// part of the array before the specified index
	...arr.slice(0, index),
	// inserted item
	newItem,
	// part of the array after the specified index
	...arr.slice(index),
];

export function transformGradientToRecord(
	gradientArray: IGradient[]
): Record<number, string> {
	const records: Record<number, string> = {};

	gradientArray.map((item) => {
		records[item.value] = item.color;
	});

	return records;
}

export function addNewColor(gradient: IGradient[], color: string): IGradient[] {
	const length = gradient.length;
	const newGradient: IGradient[] = [];

	if (length) {
		for (let i = 0; i <= length; i++) {
			if (i === 0) {
				newGradient.push({
					id: gradient[0].id,
					value: 0,
					color: gradient[0].color,
				});
			} else if (i !== length) {
				newGradient.push({
					id: gradient[i].id,
					value: round(i / length, 1),
					color: gradient[i].color,
				});
			} else {
				newGradient.push({ id: uuidv4(), value: 0.9, color: color });
			}
		}
	} else {
		newGradient.push({ id: uuidv4(), value: 0.8, color: color });
	}

	return newGradient;
}

// export function copyColor(
// 	gradient: IGradient[],
// 	newColor: string,
// 	id: string
// ): IGradient[] {
// 	const length = gradient.length;
// 	const newGradient: IGradient[] = [];

// 	if (length) {
// 		for (let i = 0; i <= length; i++) {
// 			if (i === 0) {
// 				const color = gradient[0].id === id ? newColor : gradient[0].color;
// 				newGradient.push({
// 					id: gradient[0].id,
// 					value: 0,
// 					color: color,
// 				});
// 			} else if (i !== length) {
// 				const color = gradient[i].id === id ? newColor : gradient[i].color;
// 				newGradient.push({
// 					id: gradient[i].id,
// 					value: round(i / length, 1),
// 					color: color,
// 				});
// 			} else {
// 				newGradient.push({ id: uuidv4(), value: 0.9, color: newColor });
// 			}
// 		}
// 	} else {
// 		newGradient.push({ id: uuidv4(), value: 0.8, color: color });
// 	}

// 	return newGradient;
// }

export function removeColorWithId(
	gradient: IGradient[],
	id: string
): IGradient[] {
	const filteredGradient = gradient.filter((item) => item.id !== id);
	const length = filteredGradient.length - 1;

	const newGradient: IGradient[] = [];

	for (let i = 0; i <= length; i++) {
		if (i === 0) {
			newGradient.push({
				id: filteredGradient[0].id,
				value: 0,
				color: filteredGradient[0].color,
			});
		} else if (i !== length) {
			newGradient.push({
				id: filteredGradient[i].id,
				value: round(i / length, 1),
				color: filteredGradient[i].color,
			});
		} else {
			newGradient.push({
				id: filteredGradient[i].id,
				value: 0.9,
				color: filteredGradient[i].color,
			});
		}
	}

	return newGradient;
}

export function duplicateColor(gradient: IGradient[], id: string): IGradient[] {
	const colorToDuplicate = gradient.filter((item) => item.id === id);

	const colorIndex = gradient
		.map((item) => item.id)
		.indexOf(colorToDuplicate[0].id);

	const newColor = { id: uuidv4(), value: 0, color: colorToDuplicate[0].color };
	const newGradient = [...gradient];

	return getNewValues(insert(newGradient, colorIndex, newColor));
}

export function getNewValues(gradient: IGradient[]): IGradient[] {
	const length = gradient.length - 1;

	const newGradient: IGradient[] = [];

	for (let i = 0; i <= length; i++) {
		if (i === 0) {
			newGradient.push({
				id: gradient[0].id,
				value: 0,
				color: gradient[0].color,
			});
		} else if (i !== length) {
			newGradient.push({
				id: gradient[i].id,
				value: round(i / length, 1),
				color: gradient[i].color,
			});
		} else {
			newGradient.push({
				id: gradient[i].id,
				value: 0.9,
				color: gradient[i].color,
			});
		}
	}

	return newGradient;
}

export function changeColor(
	gradient: IGradient[],
	id: string,
	color: string
): IGradient[] {
	return gradient.map((item) => {
		if (item.id === id) {
			return { ...item, color: color };
		}
		return item;
	});
}
