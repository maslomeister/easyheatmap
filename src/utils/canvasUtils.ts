// Most of the code is taken from https://github.com/precondition/precondition.github.io
const pointSize = 5;
const fillStyle = "#00b7ff";

export const drawPoint = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number
) => {
	ctx.fillStyle = fillStyle; // Red color
	ctx.beginPath();
	// Draw a point using the arc function of the canvas with a point structure.
	ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
	ctx.fill(); // This also closes the path
};

export const erasePoint = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number
) => {
	// If two circles are near one another, this may irreversibly erase parts of another circle.
	// There are no clean ways to properly undo the last canvas draw operation.
	ctx.clearRect(
		x - pointSize,
		y - pointSize,
		pointSize * Math.PI,
		pointSize * Math.PI
	);
	// The above size and offsets are somewhat arbitrary and not super precise
};

export const movePointUp = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number
) => {
	ctx.clearRect(
		x - pointSize,
		y - pointSize,
		pointSize * Math.PI,
		pointSize * Math.PI
	);

	ctx.fillStyle = fillStyle;
	ctx.beginPath();
	// Draw a point using the arc function of the canvas with a point structure.
	ctx.arc(x, y - 1, pointSize, 0, Math.PI * 2, true);
	ctx.fill();
};

export const movePointDown = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number
) => {
	ctx.clearRect(
		x - pointSize,
		y - pointSize,
		pointSize * Math.PI,
		pointSize * Math.PI
	);

	ctx.fillStyle = fillStyle;
	ctx.beginPath();
	// Draw a point using the arc function of the canvas with a point structure.
	ctx.arc(x, y + 1, pointSize, 0, Math.PI * 2, true);
	ctx.fill();
};

export const movePointLeft = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number
) => {
	ctx.clearRect(
		x - pointSize,
		y - pointSize,
		pointSize * Math.PI,
		pointSize * Math.PI
	);

	ctx.fillStyle = fillStyle;
	ctx.beginPath();
	// Draw a point using the arc function of the canvas with a point structure.
	ctx.arc(x - 1, y, pointSize, 0, Math.PI * 2, true);
	ctx.fill();
};

export const movePointRight = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number
) => {
	ctx.clearRect(
		x - pointSize,
		y - pointSize,
		pointSize * Math.PI,
		pointSize * Math.PI
	);

	ctx.fillStyle = fillStyle;
	ctx.beginPath();
	// Draw a point using the arc function of the canvas with a point structure.
	ctx.arc(x + 1, y, pointSize, 0, Math.PI * 2, true);
	ctx.fill();
};
