const arrowKeycodes = ["KeyE", "KeyD", "KeyS", "KeyF"];

export const isArrowKey = (keycode: string) => {
	if (arrowKeycodes.includes(keycode)) return true;
	return false;
};

export const movePoint = (
	keycode: string,
	up: () => void,
	down: () => void,
	left: () => void,
	right: () => void
) => {
	switch (keycode) {
		case arrowKeycodes[0]:
			up();
			break;
		case arrowKeycodes[1]:
			down();
			break;
		case arrowKeycodes[2]:
			left();
			break;
		case arrowKeycodes[3]:
			right();
			break;
	}
};

export function scaleNumber(
	number: number,
	inMin: number,
	inMax: number,
	outMin: number,
	outMax: number
) {
	return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
