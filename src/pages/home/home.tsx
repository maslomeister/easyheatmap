import React, { useEffect, useState, useRef, useMemo } from "react";

import TextareaAutosize from "react-textarea-autosize";

import { getMatrixKeys } from "@/utils/matrixUtils";
import { drawPoint, erasePoint } from "@/utils/canvasUtils";

import styles from "./home.module.scss";

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

// interface IKeyToMatrix {
// 	clause: string;
// 	x: number;
// 	y: number;
// }

const MAX_IMG_WIDTH = 1550;
const MAX_IMG_HEIGHT = 1550;

const MAX_ROW = 52;
const MAX_COL = 52;

// let rowColPointer = 0;
// const matrixToScreenTable: IMatrixToScreenTable[] = [];
const activeKey = { x: 0, y: 0 };

export function Home() {
	const brArrayRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const textAreaContainerRef = useRef<HTMLDivElement>(null);

	const [imageUploadError, setImageUploadError] = useState("");
	const [textAreaValue, setTextAreaValue] = useState("");
	const [allowedToDrawOnImage, setAllowedToDrawOnImage] = useState(false);

	const [colRowMatrix, setColRowMatrix] = useState<Array<IMatrixToScreenTable>>(
		[]
	);

	const [matrixArray, setMatrixArray] = useState<Array<string>>([]);
	const [textAreaSize, setTextAreaSize] = useState<ITextAreaSize>(
		{} as ITextAreaSize
	);
	const [canvasProperties, setCanvasProperties] = useState<ICanvas>(
		{} as ICanvas
	);
	const [canvasContext, setCanvasContext] =
		useState<CanvasRenderingContext2D>();

	const [currentKey, setCurrentKey] = useState("");
	const [nextKey, setNextKey] = useState("");
	// const [rowColCounter, setRowColCounter] = useState(0);

	// useEffect(() => {
	// 	if(keyToMatrixState.clause === "add"){
	// 		setAddedKeys([...addedKeys, ])
	// 	}

	// },[keyToMatrixState])
	// const [rowColPointer, setRowColPointer] = useState(0);
	// const [matrixToScreenTable, setMatrixToScreenTable] = useState<
	// 	Array<IMatrixToScreenTable>
	// >([]);

	// useEffect(() => {
	// 	if(rowColPointer > 0)
	// }, [rowColPointer]);
	// const [rowColPointer, setRowColPointer] = useState(0);
	// const nextKey = useMemo(() => {
	// 	if (rowColPointer && addedKeys) return addedKeys[rowColPointer];
	// 	console.log(addedKeys[rowColPointer]);
	// }, [addedKeys]);

	// useEffect(() => {
	// 	setKeyToMatrixState([
	// 		...keyToMatrixState,
	// 		(keyToMatrixState[rowColCounter] = { x: activeKey.x, y: activeKey.y }),
	// 	]);
	// }, [rowColCounter]);

	// useEffect(() => {
	// 	if (canvasContext)
	// 		drawPoint(
	// 			canvasContext,
	// 			keyToMatrixState[rowColCounter].x,
	// 			keyToMatrixState[rowColCounter].y
	// 		);
	// }, [keyToMatrixState]);

	const [textRepresentation, setTextRepresentation] = useState("");

	// useEffect(() => {
	// 	console.log(brArrayRef.current?.innerHTML);
	// }, [textRepresentation]);

	// const dangerousHtml = useMemo(() => {
	// 	if (textRepresentation) {
	// 		console.log("set dangerous html");
	// 		return { __html: textRepresentation };
	// 	}
	// }, [textRepresentation]);

	// useEffect(() => {
	// 	if (!nextKey) return;
	// 	if (textRepresentation.match(nextKey)) {
	// 		setTextRepresentation(
	// 			textRepresentation.replace(
	// 				nextKey,
	// 				`<span class="${styles["matched-key"]}">${nextKey}</span>`
	// 			)
	// 		);
	// 	}
	// }, [nextKey]);

	// useEffect(() => {
	// 	if (!currentKey) return;
	// 	if (
	// 		textRepresentation.match(
	// 			`<span class="${styles["matched-key"]}">${currentKey}</span>`
	// 		)
	// 	) {
	// 		setTextRepresentation(
	// 			textRepresentation.replace(
	// 				`<span class="${styles["matched-key"]}">${currentKey}</span>`,
	// 				`${currentKey}`
	// 			)
	// 		);
	// 	}
	// }, [currentKey]);

	useEffect(() => {
		const text = textRepresentation;

		const stringToFind = (key: string) =>
			`<span class="${styles["regular-key"]}">${key}</span>`;

		colRowMatrix.map((item) => {
			console.log(stringToFind(item.keyMatrix));
			// if (textRepresentation.match(nextKey)) {
			// }
		});
	}, [colRowMatrix, matrixArray]);

	useEffect(() => {
		// console.log(canvasProperties.image);
		// console.log(matrixArray.length);
		if (
			canvasProperties.image &&
			matrixArray.length > 0 &&
			textRepresentation
		) {
			setAllowedToDrawOnImage(true);
			// console.log("allowedToDraew");
		} else {
			setAllowedToDrawOnImage(false);
		}
	}, [canvasProperties.image, matrixArray.length, textRepresentation]);

	const onInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const matrixKeys = getMatrixKeys(event.target.value);
		const textAreaVal = event.target.value;
		if (!matrixKeys.allowed) return;
		setTextAreaValue(textAreaVal);
		setMatrixArray(getMatrixKeys(event.target.value).matrix);
		resizeOnInputChange();

		const lines = textAreaVal.split("\n");
		const array = [];
		for (let i = 0; i < lines.length; i++) {
			array.push(lines[i]);
		}
		// setBrArray(array);
		let text = "";
		for (let i = 0; i < lines.length; i++) {
			text += `<pre class="${styles["pre"]}">${lines[i]}<br></pre>`;
		}
		matrixKeys.matrix.map((item) => {
			text = text.replace(
				item,
				`<span class="${styles["regular-key"]}">${item}</span>`
			);
		});

		setTextRepresentation(text);
		setNextKey(matrixKeys.matrix.shift()!);
	};

	useEffect(() => {
		const canvasElem = canvasRef.current;
		if (!canvasElem) return;
		const context = canvasElem.getContext("2d");
		if (context) {
			setCanvasContext(context);
		}
	}, [canvasProperties.image]);

	const resizeOnInputChange = () => {
		const textAreaElem = textAreaRef.current;
		const textAreaContainerElem = textAreaContainerRef.current;
		if (!textAreaElem || !textAreaContainerElem) return;

		if (textAreaElem.scrollWidth > textAreaElem.clientWidth) {
			textAreaElem.style.margin = "0";
			textAreaElem.style.width = textAreaElem.scrollWidth + "px";
			textAreaContainerElem.style.width = textAreaElem.scrollWidth + 128 + "px";
		}

		if (textAreaElem.scrollHeight > textAreaElem.clientHeight) {
			textAreaElem.style.height = textAreaElem.scrollHeight + "px";
			textAreaContainerElem.style.height =
				textAreaElem.scrollHeight + 24 + "px";
		}

		setTextAreaSize({
			width: textAreaElem.scrollWidth,
			height: textAreaElem.scrollHeight,
		});
	};

	const addPressedOnScreenKeyToMapping = (x: number, y: number) => {
		const key = matrixArray.shift();
		if (key) {
			setColRowMatrix([...colRowMatrix, { x, y, keyMatrix: key }]);
			setCurrentKey(key);

			const filteredArrayOfKeys = matrixArray.filter((item) => item !== key);
			setNextKey(filteredArrayOfKeys.slice(0, 1)[0]);

			setMatrixArray(filteredArrayOfKeys);

			setColRowMatrix([...colRowMatrix, { x, y, keyMatrix: key }]);
			drawPoint(canvasContext!, x, y);
		}
	};

	const removePressedOnScreenKeyToMapping = (x: number, y: number) => {
		const key = currentKey;
		if (colRowMatrix.length > 0 && key) {
			const currentKeyPopped = colRowMatrix.pop()!;
			setNextKey(key);

			const updatedMatrixArray = [currentKeyPopped.keyMatrix, ...matrixArray];
			setMatrixArray(updatedMatrixArray);

			const previousKeyPopped = colRowMatrix.slice(-2).shift();
			if (previousKeyPopped) {
				setCurrentKey(previousKeyPopped.keyMatrix);
			}

			// const previousKeyPopped = slice(-2).shift();
			// if()
			// const previousKey = colRowMatrixPopped.pop();
			// setCurrentKey(previousKey!);
			// const filteredArrayOfKeys = matrixArray.filter((item) => item !== key);
			// setMatrixArray(filteredArrayOfKeys);

			setColRowMatrix(colRowMatrix.filter((item) => item !== currentKeyPopped));

			erasePoint(canvasContext!, currentKeyPopped.x, currentKeyPopped.y);
		}
	};

	// const removePressedOnScreenKeyFromMapping = (x: number, y: number) => {
	// 	const key = nextKey;
	// 	if (colRowMatrix.length > 0) {
	// 	}
	// };

	const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
		const clickX = event.nativeEvent.offsetX;
		const clickY = event.nativeEvent.offsetY;
		if (!allowedToDrawOnImage) return;
		if (!canvasContext) return;
		if (!event.shiftKey) {
			addPressedOnScreenKeyToMapping(clickX, clickY);
			// setRowColPointer(rowColPointer - 1);
			// setRowColCounter(rowColCounter - 1);
			// activeKey.x = clickX;
			// activeKey.y = clickY;
			// setKeyToMatrixState({ clause: "remove", x: clickX, y: clickY });
			// if (rowColPointer > 0) {
			// 	// rowColPointer--;
			// 	// setAddedKeys((prevState) =>
			// 	// 	prevState.filter(
			// 	// 		(prevItem) => prevItem !== matrixArray[rowColPointer]
			// 	// 	)
			// 	// );
			// 	erasePoint(
			// 		canvasContext,
			// 		matrixToScreenTable[rowColPointer].x,
			// 		matrixToScreenTable[rowColPointer].y
			// 	);
			// 	matrixToScreenTable.splice(rowColPointer, 1);
			// 	// console.log(addedKeys);
			// 	// document.getElementById("matrixToMatch").innerHTML = document
			// 	// 	.getElementById("matrixToMatch")
			// 	// 	.innerHTML.replace(
			// 	// 		matchedRowcol,
			// 	// 		'<span class="matchedKeys">' + matchedRowcol + "</span>"
			// 	// 	);
			// 	// console.log("delete at", rowColPointer);
			// 	// console.log(matrixToScreenTable);
			// }
		} else {
			removePressedOnScreenKeyToMapping(clickX, clickY); // setRowColCounter(rowColCounter + 1);
			// activeKey.x = clickX;
			// activeKey.y = clickY;
			// setKeyToMatrixState({ clause: "add", x: clickX, y: clickY });
			// if (rowColPointer < matrixArray.length) {
			// 	matrixToScreenTable[rowColPointer] = { x: clickX, y: clickY };
			// 	console.log(matrixToScreenTable);
			// 	console.log("add at", rowColPointer);
			// 	drawPoint(canvasContext, clickX, clickY);
			// 	// rowColPointer++;
			// 	console.log(
			// 		brArrayRef.current?.innerHTML.replace(
			// 			matrixArray[rowColPointer],
			// 			`<span class=${styles["matched-key"]}>' + ${matrixArray[rowColPointer]} + '</span>`
			// 		)
			// 	);
			// 	// setAddedKeys([...addedKeys, matrixArray[rowColPointer]]);
			// 	console.log(addedKeys);
		}
	};

	const handleFileRead = (e: ProgressEvent<FileReader>) => {
		const image = new Image();

		image.src = e.target?.result as string;
		image.onload = function (this: any) {
			if (this.height > MAX_IMG_HEIGHT || this.width > MAX_IMG_WIDTH) {
				setImageUploadError("Image size is too big");
			} else {
				setCanvasProperties({
					width: this.width - 12,
					height: this.height - 12,
					image: e.target?.result as string,
				});
			}
		};
	};

	const handleFileChosen = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) return;
		const fileReader = new FileReader();
		fileReader.onload = handleFileRead;
		fileReader.readAsDataURL(event.target.files[0]);
	};

	// const handleShiftKeyDown = (event: KeyboardEvent) => {
	// 	console.log(event);
	// };

	// const handleShiftKeyUp = (event: KeyboardEvent) => {
	// 	console.log(event);
	// };

	// useEffect(() => {
	// 	document.addEventListener("keydown", handleShiftKeyDown);
	// 	document.addEventListener("keyup", handleShiftKeyUp);

	// 	return () => {
	// 		document.removeEventListener("keydown", handleShiftKeyDown);
	// 		document.removeEventListener("keyup", handleShiftKeyUp);
	// 	};
	// }, []);

	const moveLastDrawnPoint = (event: KeyboardEvent) => {
		console.log(event);
		// if
	};

	useEffect(() => {
		document.addEventListener("keydwon", moveLastDrawnPoint);
	}, []);

	return (
		<div
			className={`${styles.home} ${
				canvasProperties.image ? styles["home--top"] : ""
			}`}
		>
			<div className={styles["layout-image-container"]}>
				{!canvasProperties.width && (
					<div className={styles["file-input"]}>
						<input
							type="file"
							id="file"
							className={styles.file}
							onChange={handleFileChosen}
						/>
						<label htmlFor="file">Upload Keyboard image</label>
					</div>
				)}
				{canvasProperties.width && (
					<canvas
						width={canvasProperties.width}
						height={canvasProperties.height}
						onClick={handleCanvasClick}
						style={{
							backgroundImage: `url(${canvasProperties.image})`,
							backgroundPosition: "-6px -6px",
						}}
						ref={canvasRef}
					/>
				)}
			</div>
			{textRepresentation && (
				<div className={styles["current-key-helper"]}>
					<p className={allowedToDrawOnImage ? "noselect" : ""}>
						Click the key on picture that corresponds to{" "}
						<span className={styles["active-key"]}>{nextKey}</span>
					</p>
					<p className={`subtext ${allowedToDrawOnImage ? "noselect" : ""}`}>
						Hold{" "}
						<span style={{ color: "var(--accent-color-blue)" }}>shift</span> and
						click on picture to remove last selected key, use{" "}
						<span style={{ color: "var(--accent-color-blue)" }}>arrows</span> to
						for precise control
					</p>
				</div>
			)}
			<div className={styles["textarea-container"]}>
				<div className={styles["textarea-wrapper"]} ref={textAreaContainerRef}>
					{!textRepresentation && (
						<textarea
							onChange={onInputChange}
							onKeyDown={moveLastDrawnPoint}
							className={styles.textarea}
							placeholder="// Paste matrix layout outputted by 'qmk info -m' here"
							rows={2}
							cols={53}
							ref={textAreaRef}
						/>
					)}
					{textRepresentation && (
						<div
							className={allowedToDrawOnImage ? "noselect" : ""}
							style={{ width: textAreaSize.width, height: textAreaSize.height }}
							ref={brArrayRef}
							dangerouslySetInnerHTML={{ __html: textRepresentation }}
							key={nextKey}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
