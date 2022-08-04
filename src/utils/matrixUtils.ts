// Most of the code is taken from https://github.com/precondition/precondition.github.io

// Constants taken from here:
// https://github.com/qmk/qmk_firmware/blob/620a946d01477b64ee2f719141aa35400c0188c6/lib/python/qmk/constants.py#L22...L24
const ROW_LETTERS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnop";
const COL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijilmnopqrstuvwxyz";
// Taken from the length of ROW_LETTERS and COL_LETTERS
// For some reason `\b` gets turned into a weird unicode character
// if only one backslash is used.
const helperStartPattern = new RegExp(`┌──┐`, "g");
const helperEndPattern = new RegExp(`└──┘`, "g");
const rowcolPattern = new RegExp(`\\b[${ROW_LETTERS}][${COL_LETTERS}]\\b`, "g");

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
