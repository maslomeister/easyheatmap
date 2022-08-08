import React, { useRef, useEffect, useCallback } from "react";

import { useAppDispatch, useAppSelector } from "@/services/hooks";

import { HotnessScale } from "@/components/hotness-scale/hotness-scale";

import {
	setKeyboardImage,
	setMatrixArray,
	setMatrixImageMapping,
	setCurrentKey,
	setNextKey,
	setTextRepresentation,
	shiftMatrixArray,
	setSetupState,
	moveCurrentKeyUp,
	moveCurrentKeyDown,
	moveCurrentKeyLeft,
	moveCurrentKeyRight,
} from "@/services/reducers/setup-reducer";
import { MAX_IMAGE_HEIGHT, MAX_IMAGE_WIDTH } from "@/constants/constants";

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
	const dispatch = useAppDispatch();
	const {
		keyboardImage,
		matrixArray,
		textRepresentation,
		matrixImageMapping,
		currentKey,
		setupState,
	} = useAppSelector((state) => state.setup);
	const keyboardImageRef = useRef<HTMLCanvasElement>(null);

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
						width: this.width,
						height: this.height,
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

	const isTextMatrixFinished = useCallback(() => {
		if (matrixArray.length === 0 && matrixImageMapping.length > 0) {
			return true;
		}
		return false;
	}, [matrixImageMapping, matrixArray]);

	const addPressedOnScreenKeyToMapping = (x: number, y: number) => {
		const keycode = matrixArray[0];
		dispatch(shiftMatrixArray());
		let textArea = textRepresentation;
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
		} else {
			if (isTextMatrixFinished()) {
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

		const clickX = event.nativeEvent.offsetX;
		const clickY = event.nativeEvent.offsetY;

		if (!event.shiftKey) {
			addPressedOnScreenKeyToMapping(clickX, clickY);
		} else {
			removePressedOnScreenKeyToMapping();
		}
	};

	const checkArrowPress = useCallback(
		(event: KeyboardEvent) => {
			if (setupState !== "imageUpload") return;
			const keycode = event.code;

			if (!isArrowKey(keycode)) return;

			if (!currentKey) return;

			if (!canvasContext) return;

			movePoint(
				keycode,
				() => {
					dispatch(moveCurrentKeyUp(currentKey));
					movePointUp(canvasContext, currentKey.x, currentKey.y);
				},
				() => {
					dispatch(moveCurrentKeyDown(currentKey));
					movePointDown(canvasContext, currentKey.x, currentKey.y);
				},
				() => {
					dispatch(moveCurrentKeyLeft(currentKey));
					movePointLeft(canvasContext, currentKey.x, currentKey.y);
				},
				() => {
					dispatch(moveCurrentKeyRight(currentKey));
					movePointRight(canvasContext, currentKey.x, currentKey.y);
				}
			);
		},
		[canvasContext, currentKey.x, currentKey.y, matrixImageMapping, setupState]
	);

	useEffect(() => {
		window.addEventListener("keydown", checkArrowPress);

		return () => {
			window.removeEventListener("keydown", checkArrowPress);
		};
	}, [canvasContext, currentKey, matrixImageMapping, setupState]);

	return (
		<div
			className={styles["layout-image-container"]}
			style={{
				pointerEvents: setupState === "logfileUpload" ? "none" : undefined,
			}}
		>
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
						width: keyboardImage.width + 160,
						height: keyboardImage.height + 200,
					}}
				>
					<div
						className={styles["canvas--centered"]}
						style={{
							width: keyboardImage.width + 160,
							height: keyboardImage.height + 200,
							pointerEvents:
								setupState === "logfileUpload" ? "none" : undefined,
						}}
						onClick={handleMouseClick}
						ref={keyboardOverlayRef}
						id="keyboardLayer"
					>
						<canvas
							className={styles["canvas--centered"]}
							width={keyboardImage.width + 160}
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
								pointerEvents: "none",
								zIndex: "0",
							}}
						/>
						<div
							style={{
								right: "124px",
								top: "24px",
								position: "absolute",
							}}
						>
							<HotnessScale />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
