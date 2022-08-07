import React, { useState, useRef, useEffect } from "react";
import Papa from "papaparse";

import { useAppDispatch, useAppSelector } from "@/services/hooks";
import {
	setKeyboardImage,
	setMatrixArray,
	setMatrixImageMapping,
	setCurrentKey,
	setNextKey,
	setTextRepresentation,
	shiftMatrixArray,
	setSetupState,
} from "@/services/reducers/setup-reducer";
import { MAX_IMAGE_HEIGHT, MAX_IMAGE_WIDTH } from "@/constants/constants";

import { getMatrixKeys, processCsv } from "@/utils/matrixUtils";
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

import styles from "./image-layout.module.scss";

type Props = {
	canvasContext?: CanvasRenderingContext2D;
	setCanvasContext: (canvasContext: CanvasRenderingContext2D) => void;
	setConfig: (config: IConfig) => void;
	keyboardOverlayRef: React.RefObject<HTMLDivElement>;

	updateHeatmapConfig: (
		HTMLDivElement: HTMLDivElement,
		width: number,
		height: number
	) => void;
};

export function ImageLayout({
	canvasContext,
	setCanvasContext,
	setConfig,
	keyboardOverlayRef,
	updateHeatmapConfig,
}: Props) {
	// const keyboardOverlayRef = useRef<HTMLDivElement>(null);
	const keyboardImageRef = useRef<HTMLCanvasElement>(null);

	const dispatch = useAppDispatch();
	const {
		keyboardImage,
		matrixArray,
		textRepresentation,
		matrixImageMapping,
		currentKey,
		setupState,
	} = useAppSelector((state) => state.setup);

	const regularKey = (key: string) => `<span class="regular-key">${key}</span>`;

	const matchedKey = (key: string) => `<span class="matched-key">${key}</span>`;

	useEffect(() => {
		const canvasElem = keyboardImageRef.current;
		if (!canvasElem) return;
		const context = canvasElem.getContext("2d");
		if (context) {
			setCanvasContext(context);
		}

		const keyboardLayerElem = keyboardOverlayRef.current;

		if (keyboardLayerElem) {
			updateHeatmapConfig(
				keyboardLayerElem,
				Number(keyboardLayerElem.style.width.split("px")[0]),
				Number(keyboardLayerElem.style.height.split("px")[0])
			);
		}
	}, [keyboardImage]);

	const handleFileRead = (e: ProgressEvent<FileReader>) => {
		const image = new Image();

		image.src = e.target?.result as string;
		image.onload = function (this: any) {
			if (this.height > MAX_IMAGE_HEIGHT || this.width > MAX_IMAGE_WIDTH) {
				//TODO maybe show error or something if image is too big
			} else {
				dispatch(
					setKeyboardImage({
						width: this.width - 12,
						height: this.height - 12,
						src: e.target?.result as string,
					})
				);
			}
		};
	};

	const handleFileChosen = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) return;
		const fileReader = new FileReader();
		fileReader.onload = handleFileRead;
		fileReader.readAsDataURL(event.target.files[0]);
	};

	const addPressedOnScreenKeyToMapping = (x: number, y: number) => {
		const keycode = matrixArray[0];
		dispatch(shiftMatrixArray());
		let textArea = textRepresentation;
		console.log(canvasContext);
		if (!canvasContext) return;
		if (keycode) {
			dispatch(
				setMatrixImageMapping([...matrixImageMapping, { x, y, keycode }])
			);
			dispatch(setCurrentKey({ keycode, x, y }));

			setMatrixImageMapping([...matrixImageMapping, { x, y, keycode }]);
			drawPoint(canvasContext, x, y);

			if (textArea.match(regularKey(keycode))) {
				dispatch(
					setTextRepresentation(
						(textArea = textArea.replace(
							regularKey(keycode),
							matchedKey(keycode)
						))
					)
				);
			}

			if (
				matrixImageMapping.length > 0 &&
				!matrixArray[matrixArray.length - 2]
			) {
				setConfig({
					keyboardImage,
					matrixImageMapping,
				});
				dispatch(setSetupState("logfileUpload"));
				eraseAll(
					canvasContext,
					keyboardImage.width + 200,
					keyboardImage.height + 200
				);
			}
		}
	};

	const removePressedOnScreenKeyToMapping = () => {
		const key = currentKey;
		let textArea = textRepresentation;
		// console.log(textArea);
		if (matrixImageMapping.length > 0 && key && canvasContext) {
			const currentKeyPopped =
				matrixImageMapping[matrixImageMapping.length - 1];
			dispatch(setNextKey(key.keycode));

			const updatedMatrixArray = [currentKeyPopped.keycode, ...matrixArray];
			dispatch(setMatrixArray(updatedMatrixArray));

			const previousKeyPopped =
				matrixImageMapping[matrixImageMapping.length - 2];
			if (previousKeyPopped) {
				dispatch(setCurrentKey(previousKeyPopped));
			}

			dispatch(
				setMatrixImageMapping(
					matrixImageMapping.filter((item) => item !== currentKeyPopped)
				)
			);

			erasePoint(canvasContext, currentKeyPopped.x, currentKeyPopped.y);

			if (textArea.match(matchedKey(key.keycode))) {
				dispatch(
					setTextRepresentation(
						(textArea = textArea.replace(
							matchedKey(key.keycode),
							regularKey(key.keycode)
						))
					)
				);
			}
		}
	};

	const handleMouseClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (setupState !== "imageUpload") return;
		// console.log(event);
		const clickX = event.nativeEvent.offsetX;
		const clickY = event.nativeEvent.offsetY;
		// console.log(clickX, clickY);
		if (!event.shiftKey) {
			addPressedOnScreenKeyToMapping(clickX, clickY);
		} else {
			removePressedOnScreenKeyToMapping();
		}
	};

	return (
		<div className={styles["layout-image-container"]}>
			{!keyboardImage.src && (
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
			{keyboardImage.src && (
				<div
					className={styles["keyboard__layer"]}
					style={{
						width: keyboardImage.width,
						height: keyboardImage.height,
					}}
				>
					<div
						className={styles["canvas--centered"]}
						// className={styles["canvases-container"]}
						style={{
							width: keyboardImage.width + 200,
							height: keyboardImage.height + 200,
							// pointerEvents: "none",
						}}
						onClick={handleMouseClick}
						ref={keyboardOverlayRef}
						// key={heatmapLoaded}
					>
						<canvas
							className={styles["canvas--centered"]}
							width={keyboardImage.width + 200}
							height={keyboardImage.height + 200}
							style={{
								zIndex: "1",
							}}
							ref={keyboardImageRef}
						/>
						<canvas
							className={styles["canvas--centered"]}
							width={keyboardImage.width}
							height={keyboardImage.height}
							style={{
								backgroundImage: `url(${keyboardImage.src})`,
								backgroundPosition: "-6px -6px",
								zIndex: "0",
								pointerEvents: "none",
							}}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
