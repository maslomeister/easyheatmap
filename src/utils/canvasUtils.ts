// Most of the code is taken from https://github.com/precondition/precondition.github.io
export const drawPoint = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number
) => {
	const pointSize = 5;
	ctx.fillStyle = "#00b7ff"; // Red color
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
	const pointSize = 5;
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
