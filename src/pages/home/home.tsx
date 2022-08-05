import React, {
	useEffect,
	useState,
	useRef,
	useMemo,
	useCallback,
} from "react";
import Papa from "papaparse";
import HeatMap from "heatmap-ts";

import { useLocalStorage } from "usehooks-ts";

import { notEmptyLine, getMatrixKeys, processCsv } from "@/utils/matrixUtils";
import {
	drawPoint,
	erasePoint,
	movePointUp,
	movePointDown,
	movePointLeft,
	movePointRight,
	eraseAll,
} from "@/utils/canvasUtils";
import { isArrowKey, movePoint } from "@/utils/helpers";

import styles from "./home.module.scss";
import { text } from "node:stream/consumers";

const MAX_IMG_WIDTH = 1550;
const MAX_IMG_HEIGHT = 1550;

// let rowColPointer = 0;
// const matrixToScreenTable: IMatrixToScreenTable[] = [];
const activeKey = { x: 0, y: 0 };

// type Entries<T> = {
// 	[K in keyof T]: [K, T[K]];
// }[keyof T][];

// const entries = <Obj,>(obj: Obj) => Object.entries(obj) as Entries<Obj>;

// const mapRecordToMap = <MyString extends string>(
// 	data: Record<
// 		number,
// 		{
// 			x: number;
// 			y: number;
// 			value: number;
// 			rowcol: string;
// 		}[]
// 	>
// ) =>
// 	entries(data).reduce(
// 		(acc, [key, value]) => {
// 			acc.set(key, new Map(value));
// 			return acc;
// 		},
// 		new Map<
// 			MyString,
// 			Map<
// 				number,
// 				{
// 					x: number;
// 					y: number;
// 					value: number;
// 					rowcol: string;
// 				}
// 			>
// 		>()
// 	);

export function Home() {
	const [isConfig, setConfig] = useLocalStorage<IConfig>(
		"config",
		{} as IConfig
	);

	const keyboardLayerRef = useRef<HTMLDivElement>(null);
	const brArrayRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const textAreaContainerRef = useRef<HTMLDivElement>(null);

	const [heatmapData, setHeatmapData] = useState<
		Record<
			number,
			{
				x: number;
				y: number;
				value: number;
			}[]
		>
	>({});

	const [imageUploadError, setImageUploadError] = useState("");
	const [allowedToDrawOnImage, setAllowedToDrawOnImage] = useState(false);

	const [readyToDisplayLogs, setReadyToDisplayLogs] = useState(false);

	const [matrixToImage, setMatrixToImage] = useState<Array<IMatrixToImage>>([]);

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
	const [heatmapPresent, setHeatmapPresent] = useState(true);

	const [textRepresentation, setTextRepresentation] = useState("");

	const regularKey = (key: string) =>
		`<span class="${styles["regular-key"]}">${key}</span>`;

	const matchedKey = (key: string) =>
		`<span class="${styles["matched-key"]}">${key}</span>`;

	useEffect(() => {
		if (heatmapData[0] && canvasContext) {
			console.log(
				keyboardLayerRef.current!.getElementsByClassName("heatmap-canvas")
			);
			for (const cnvs of keyboardLayerRef.current!.getElementsByClassName(
				"heatmap-canvas"
			)) {
				cnvs.remove();
			}
			const heatmap = new HeatMap({
				container: keyboardLayerRef.current!,
				maxOpacity: 0.3,
				radius: 50,
				blur: 0.8,
				width: canvasProperties.width,
				height: canvasProperties.height,
				gradient: {
					// enter n keys between 0 and 1 here
					// for gradient color customization
					0.6: "blue",
					0.9: "red",
					// 0: "white",
				},
			});
			// mapRecordToMap<string>(heatmapData);

			const dataPoints = heatmapData[0];

			heatmap.setData({ max: 14085, data: dataPoints });
			heatmap.repaint();

			console.log(heatmap);

			// console.log(heatmap);
			setHeatmapPresent(true);
		}
	}, [heatmapData]);

	const handleChangeHeatmap = () => {
		console.log("pressed");
	};

	useEffect(() => {
		if (isConfig.matrixToImage && isConfig.image) {
			setCanvasProperties(isConfig.image);
			setMatrixToImage(isConfig.matrixToImage);
			setReadyToDisplayLogs(true);
		}
	}, []);

	useEffect(() => {
		if (
			canvasProperties.image &&
			matrixArray.length > 0 &&
			textRepresentation
		) {
			setAllowedToDrawOnImage(true);
		} else {
			setAllowedToDrawOnImage(false);
		}
	}, [canvasProperties, matrixArray, textRepresentation]);

	const onInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const matrixKeys = getMatrixKeys(event.target.value);
		const textAreaVal = event.target.value;
		if (!matrixKeys.allowed) return;
		setMatrixArray(getMatrixKeys(event.target.value).matrix);
		resizeOnInputChange();

		const lines = textAreaVal.split("\n");

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
		setNextKey(matrixKeys.matrix[0]);
	};

	useEffect(() => {
		const canvasElem = canvasRef.current;
		if (!canvasElem) return;
		const context = canvasElem.getContext("2d");
		if (context) {
			setCanvasContext(context);
		}
	}, [canvasProperties]);

	const resizeOnInputChange = () => {
		const textAreaElem = textAreaRef.current;
		const keyboardLayerElem = keyboardLayerRef.current;
		const textAreaContainerElem = textAreaContainerRef.current;
		if (!textAreaElem || !textAreaContainerElem || !keyboardLayerElem) return;

		if (textAreaElem.scrollWidth > textAreaElem.clientWidth) {
			textAreaElem.style.margin = "0";
			textAreaElem.style.width = textAreaElem.scrollWidth + "px";
			textAreaContainerElem.style.width = textAreaElem.scrollWidth - 50 + "px";
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
		let textArea = textRepresentation;
		if (key && canvasContext) {
			setMatrixToImage([...matrixToImage, { x, y, keyMatrix: key }]);
			setCurrentKey(key);

			const filteredArrayOfKeys = matrixArray.filter((item) => item !== key);
			setNextKey(filteredArrayOfKeys.slice(0, 1)[0]);

			setMatrixArray(filteredArrayOfKeys);

			setMatrixToImage([...matrixToImage, { x, y, keyMatrix: key }]);
			drawPoint(canvasContext, x, y);

			if (textArea.match(regularKey(key))) {
				setTextRepresentation(
					(textArea = textArea.replace(regularKey(key), matchedKey(key)))
				);
			}

			if (
				filteredArrayOfKeys.slice(0, 1)[0] === undefined &&
				matrixToImage.length > 0 &&
				matrixArray.length === 0
			) {
				setConfig({
					image: canvasProperties,
					matrixToImage: matrixToImage,
				});
				setReadyToDisplayLogs(true);
				eraseAll(
					canvasContext,
					canvasProperties.width,
					canvasProperties.height
				);
			}
		}
	};

	const removePressedOnScreenKeyToMapping = () => {
		const key = currentKey;
		let textArea = textRepresentation;
		if (matrixToImage.length > 0 && key && canvasContext) {
			const currentKeyPopped = matrixToImage[matrixToImage.length - 1];
			setNextKey(key);

			const updatedMatrixArray = [currentKeyPopped.keyMatrix, ...matrixArray];
			setMatrixArray(updatedMatrixArray);

			const previousKeyPopped = matrixToImage[matrixToImage.length - 2];
			if (previousKeyPopped) {
				setCurrentKey(previousKeyPopped.keyMatrix);
			}

			setMatrixToImage(
				matrixToImage.filter((item) => item !== currentKeyPopped)
			);

			erasePoint(canvasContext, currentKeyPopped.x, currentKeyPopped.y);

			if (textArea.match(matchedKey(key))) {
				setTextRepresentation(
					(textArea = textArea.replace(matchedKey(key), regularKey(key)))
				);
			}
		}
	};

	const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
		const clickX = event.nativeEvent.offsetX;
		const clickY = event.nativeEvent.offsetY;
		if (!allowedToDrawOnImage) return;
		if (!canvasContext) return;
		if (!event.shiftKey) {
			addPressedOnScreenKeyToMapping(clickX, clickY);
		} else {
			removePressedOnScreenKeyToMapping();
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

	const handleCsvFile = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) return;
		const reader = new FileReader();
		const file = event.target.files[0];

		reader.onload = () => {
			Papa.parse<[]>(file, {
				worker: true,
				dynamicTyping: true,
				skipEmptyLines: "greedy",
				// header: true,
				// step: function (row) {
				// 	// console.log("Row:", row.data);
				// },
				complete: function (results) {
					event.target.value = "";
					setHeatmapData(processCsv(results.data, matrixToImage));
				},
			});
		};
		reader.readAsText(file);
	};

	const checkArrowPress = useCallback(
		(event: KeyboardEvent) => {
			const keyCode = event.code;

			if (!isArrowKey(keyCode)) return;

			const currentKey = matrixToImage[matrixToImage.length - 1];

			if (!currentKey) return;

			if (!canvasContext) return;

			movePoint(
				keyCode,
				() => {
					setMatrixToImage(
						matrixToImage.map((item) => {
							if (item.keyMatrix === currentKey.keyMatrix) {
								return { keyMatrix: item.keyMatrix, x: item.x, y: item.y - 1 };
							}
							return item;
						})
					);
					movePointUp(canvasContext, currentKey.x, currentKey.y);
				},
				() => {
					setMatrixToImage(
						matrixToImage.map((item) => {
							if (item.keyMatrix === currentKey.keyMatrix) {
								return { keyMatrix: item.keyMatrix, x: item.x, y: item.y + 1 };
							}
							return item;
						})
					);
					movePointDown(canvasContext, currentKey.x, currentKey.y);
				},
				() => {
					setMatrixToImage(
						matrixToImage.map((item) => {
							if (item.keyMatrix === currentKey.keyMatrix) {
								return {
									keyMatrix: item.keyMatrix,
									x: item.x - 1,
									y: item.y,
								};
							}
							return item;
						})
					);
					movePointLeft(canvasContext, currentKey.x, currentKey.y);
				},
				() => {
					setMatrixToImage(
						matrixToImage.map((item) => {
							if (item.keyMatrix === currentKey.keyMatrix) {
								return {
									keyMatrix: item.keyMatrix,
									x: item.x + 1,
									y: item.y,
								};
							}
							return item;
						})
					);
					movePointRight(canvasContext, currentKey.x, currentKey.y);
				}
			);
		},
		[canvasContext, currentKey, matrixToImage]
	);

	useEffect(() => {
		window.addEventListener("keydown", checkArrowPress);

		return () => {
			window.removeEventListener("keydown", checkArrowPress);
		};
	}, [canvasContext, currentKey, matrixToImage]);

	return (
		<div
			className={`${styles.home} ${
				allowedToDrawOnImage ? styles["home--top"] : ""
			}`}
		>
			<div className={styles["layout-image-container"]}>
				{!canvasProperties.width && (
					<div className={styles["file-input"]}>
						<input
							type="file"
							id="file"
							accept=".png,.jpg"
							className={styles.file}
							onChange={handleFileChosen}
						/>
						<label htmlFor="file">Upload Keyboard image</label>
					</div>
				)}
				{canvasProperties.width && (
					<div
						id="keyboard-layer-id"
						className={styles["keyboard-layer"]}
						ref={keyboardLayerRef}
						// style={{
						// 	width: canvasProperties.width,
						// 	height: canvasProperties.height,
						// 	aspectRatio: `auto ${canvasProperties.width} / ${canvasProperties.height}`,
						// }}
					>
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
					</div>
				)}
			</div>
			{readyToDisplayLogs ? (
				<div>
					<div className={styles["file-input"]}>
						<input
							type="file"
							id="file"
							accept=".csv"
							className={styles.file}
							onChange={handleCsvFile}
						/>
						<label htmlFor="file">Upload keylog file</label>
					</div>
				</div>
			) : (
				<>
					{textRepresentation && (
						<div className={styles["current-key-helper"]}>
							<p className={allowedToDrawOnImage ? "noselect" : ""}>
								Click the key on picture that corresponds to{" "}
								<span className={styles["active-key"]}>{nextKey}</span>
							</p>
							<p
								className={`subtext ${allowedToDrawOnImage ? "noselect" : ""}`}
							>
								Hold{" "}
								<span style={{ color: "var(--accent-color-bright-blue)" }}>
									shift
								</span>{" "}
								and click on picture to remove last selected key, use{" "}
								<span style={{ color: "var(--accent-color-bright-blue)" }}>
									arrows
								</span>{" "}
								to to correct position
							</p>
						</div>
					)}
					<div className={styles["textarea-container"]}>
						<div
							className={styles["textarea-wrapper"]}
							ref={textAreaContainerRef}
						>
							{!textRepresentation && (
								<textarea
									onChange={onInputChange}
									className={styles.textarea}
									placeholder="// Paste matrix layout here"
									rows={2}
									cols={25}
									ref={textAreaRef}
								/>
							)}
							{textRepresentation && (
								<div
									className={allowedToDrawOnImage ? "noselect" : ""}
									style={{
										width: textAreaSize.width,
										height: textAreaSize.height,
									}}
									ref={brArrayRef}
									dangerouslySetInnerHTML={{ __html: textRepresentation }}
									key={nextKey}
								/>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
