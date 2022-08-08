import React, { useEffect, useState, useRef, useMemo } from "react";
import Papa from "papaparse";
import HeatMap from "heatmap-ts";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useLocalStorage } from "usehooks-ts";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";

import { useAppDispatch, useAppSelector } from "@/services/hooks";
import {
	setKeyboardImage,
	setMatrixImageMapping,
	setSetupState,
	updateHeatmapSettings,
	setHeatmapData,
} from "@/services/reducers/setup-reducer";

import {
	DEFAULT_RADIUS,
	DEFAULT_OPACITY,
	DEFAULT_MAX_OPACITY,
	DEFAULT_CURRENT_LAYER,
	DEFAULT_GRADIENT,
} from "@/constants/constants";

import { scaleNumber } from "@/utils/helpers";
import { transformGradientToRecord } from "@/utils/colorArrayHelpers";

import { ColorsArray } from "./components/colors-array/colors-array";
import { ImageLayout } from "./components/image-layout/image-layout";
import { TextMatrix } from "./components/text-matrix/text-matrix";

import styles from "./home.module.scss";

function SimpleSlider({
	min,
	max,
	step = 1,
	value,
	onChange,
}: {
	min: number;
	max: number;
	step?: number;
	value: number;
	onChange: (value: number) => void;
}) {
	const handleValue = (value: number | number[]) => {
		if (typeof value === "number") {
			onChange(value);
		}
	};

	return (
		<Slider
			min={min}
			max={max}
			step={step}
			value={value}
			onChange={handleValue}
			handleStyle={{
				height: 18,
				width: 18,
				backgroundColor: "#5071b4",
				opacity: 1,
				border: 0,
			}}
			trackStyle={{
				background: "#4a5976",
			}}
			railStyle={{
				background: "#272727",
			}}
		/>
	);
}

export function Home() {
	const keyboardOverlayRef = useRef<HTMLDivElement>(null);

	const [heatmap, setHeatmap] = useState<HeatMap>();
	const [showColorPicker, setShowColorPicker] = useState<IGradient>(
		{} as IGradient
	);

	const [heatmapInit, setHeatmapInit] = useState<{
		container: HTMLDivElement;
		width: number;
		height: number;
	}>();

	const [isConfig, setConfig] = useLocalStorage<IConfig>(
		"config",
		{} as IConfig
	);

	const dispatch = useAppDispatch();
	const { heatmapData, heatmapSettings, setupState, matrixImageMapping } =
		useAppSelector((state) => state.setup);

	const handleLayer = (value: number) => {
		dispatch(
			updateHeatmapSettings({
				...heatmapSettings,
				currentLayer: value,
			})
		);
	};

	const handleRadius = (value: number) => {
		dispatch(
			updateHeatmapSettings({
				...heatmapSettings,
				radius: value,
			})
		);
	};

	const handleOpacity = (value: number) => {
		dispatch(
			updateHeatmapSettings({
				...heatmapSettings,
				opacity: value,
			})
		);
	};

	const handleMaxOpacity = (value: number) => {
		dispatch(
			updateHeatmapSettings({
				...heatmapSettings,
				maxOpacity: value,
			})
		);
	};

	const updateGradient = (gradient: IGradient[]) => {
		dispatch(
			updateHeatmapSettings({
				...heatmapSettings,
				gradient,
			})
		);
	};

	const [canvasContext, setCanvasContext] =
		useState<CanvasRenderingContext2D>();

	// init heatmapjs
	useEffect(() => {
		if (!heatmap && heatmapInit) {
			setHeatmap(
				new HeatMap({
					container: heatmapInit.container,
					width: heatmapInit.width,
					height: heatmapInit.height,
				})
			);
		}
	}, [heatmapInit]);

	const saveScreenshot = () => {
		const element = document.getElementById("keyboardLayer");
		if (!element) return;

		htmlToImage
			.toPng(element)
			.then(function (dataUrl) {
				if (window.saveAs) {
					window.saveAs(dataUrl, "heatmap_image.png");
				} else {
					saveAs(dataUrl, "heatmap_image.png");
				}
			})
			.catch(function (error) {
				console.error("oops, something went wrong!", error);
			});
	};

	useEffect(() => {
		if (
			heatmap &&
			heatmapData[heatmapSettings.currentLayer] &&
			heatmapSettings
		) {
			setConfig({ ...isConfig, heatmapSettings });
			heatmap.store.radius = heatmapSettings.radius;
			heatmap.renderer.canvas.style.opacity =
				heatmapSettings.opacity.toString();
			heatmap.renderer.maxOpacity = scaleNumber(
				heatmapSettings.maxOpacity,
				0,
				1,
				0,
				255
			);

			heatmap.renderer._updateGradient({
				...heatmap.config,
				gradient: transformGradientToRecord(heatmapSettings.gradient),
			});

			heatmap.setData({
				max: heatmapData[heatmapSettings.currentLayer].maxKeyPresses,
				data: heatmapData[heatmapSettings.currentLayer].dataPoints,
			});
		}
	}, [heatmapSettings, heatmapData]);

	useEffect(() => {
		if (isConfig.matrixImageMapping && isConfig.keyboardImage) {
			dispatch(setKeyboardImage(isConfig.keyboardImage));
			dispatch(setMatrixImageMapping(isConfig.matrixImageMapping));
			dispatch(setSetupState("logfileUpload"));

			const configHeatmapSettings = isConfig.heatmapSettings;
			if (configHeatmapSettings) {
				dispatch(updateHeatmapSettings(configHeatmapSettings));
			} else {
				dispatch(
					updateHeatmapSettings({
						radius: DEFAULT_RADIUS,
						opacity: DEFAULT_OPACITY,
						maxOpacity: DEFAULT_MAX_OPACITY,
						currentLayer: DEFAULT_CURRENT_LAYER,
						gradient: DEFAULT_GRADIENT,
					})
				);
			}
		}
	}, []);

	const updateHeatmapConfig = (
		container: HTMLDivElement,
		width: number,
		height: number
	) => {
		setHeatmapInit({ container: container, width, height });
	};

	// const handleCsvFile = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	if (!event.target.files) return;
	// 	const reader = new FileReader();
	// 	const file = event.target.files[0];

	// 	reader.onload = () => {
	// 		Papa.parse<[]>(file, {
	// 			worker: true,
	// 			dynamicTyping: true,
	// 			skipEmptyLines: "greedy",

	// 			complete: function (results) {
	// 				event.target.value = "";

	// 				dispatch(
	// 					setHeatmapData(processCsv(results.data, matrixImageMapping))
	// 				);
	// 			},
	// 		});
	// 	};
	// 	reader.readAsText(file);
	// };

	const renderTextArea = useMemo(() => {
		if (setupState !== "logfileUpload") {
			return true;
		} else {
			return false;
		}
	}, [setupState]);

	const renderImageLayout = useMemo(() => {
		if (setupState === "imageUpload" || setupState === "logfileUpload") {
			return true;
		} else {
			return false;
		}
	}, [setupState]);

	const renderControls = useMemo(() => {
		if (heatmapData[0]) {
			return true;
		} else {
			return false;
		}
	}, [heatmapData]);

	return (
		<div className={styles.home}>
			{renderImageLayout && (
				<>
					<div className={styles["view-heatmap"]}>
						<div className={styles["controls-container"]}>
							{renderControls && (
								<div className={styles.controls}>
									<div className={styles.item}>
										<div className={styles["text__items"]}>
											<p className={styles["controls__text"]}>radius</p>
											<p className={styles["controls__text"]}>
												{heatmapSettings.radius}
											</p>
										</div>
										<SimpleSlider
											min={10}
											max={100}
											value={heatmapSettings.radius}
											onChange={handleRadius}
										/>
									</div>
									<div className={styles.item}>
										<div className={styles["text__items"]}>
											<p className={styles["controls__text"]}>opacity</p>
											<p className={styles["controls__text"]}>
												{heatmapSettings.opacity}
											</p>
										</div>
										<SimpleSlider
											min={0}
											max={1}
											step={0.01}
											value={heatmapSettings.opacity}
											onChange={handleOpacity}
										/>
									</div>
									<div className={styles.item}>
										<div className={styles["text__items"]}>
											<p className={styles["controls__text"]}>
												fingers opacity
											</p>
											<p className={styles["controls__text"]}>
												{heatmapSettings.maxOpacity}
											</p>
										</div>
										<SimpleSlider
											min={0}
											max={1}
											step={0.01}
											value={heatmapSettings.maxOpacity}
											onChange={handleMaxOpacity}
										/>
									</div>
									<div className={styles.item}>
										<div className={styles["text__items"]}>
											<p className={styles["controls__text"]}>layer</p>
											<p className={styles["controls__text"]}>
												{heatmapSettings.currentLayer == heatmapData.length - 1
													? "combined"
													: heatmapSettings.currentLayer}
											</p>
										</div>
										<SimpleSlider
											min={0}
											max={heatmapData.length - 1}
											value={heatmapSettings.currentLayer}
											onChange={handleLayer}
										/>
									</div>

									<ColorsArray
										gradient={heatmapSettings.gradient}
										updateGradient={updateGradient}
										saveScreenshot={saveScreenshot}
										setShowColorPicker={setShowColorPicker}
										showColorPicker={showColorPicker}
									/>
								</div>
							)}
						</div>
						<ImageLayout
							canvasContext={canvasContext}
							setCanvasContext={setCanvasContext}
							setConfig={setConfig}
							keyboardOverlayRef={keyboardOverlayRef}
							updateHeatmapConfig={updateHeatmapConfig}
						/>
					</div>
				</>
			)}
			{renderTextArea && <TextMatrix />}
		</div>
	);
}
