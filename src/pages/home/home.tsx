import React, {
	useEffect,
	useState,
	useRef,
	useCallback,
	useMemo,
} from "react";
import Papa from "papaparse";
import HeatMap from "heatmap-ts";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useLocalStorage } from "usehooks-ts";

import { useAppDispatch, useAppSelector } from "@/services/hooks";
import {
	setNextKey,
	setMatrixArray,
	setTextRepresentation,
	setTextAreaSize,
	setKeyboardImage,
	setMatrixImageMapping,
	setSetupState,
	moveCurrentKeyUp,
	moveCurrentKeyDown,
	moveCurrentKeyLeft,
	moveCurrentKeyRight,
} from "@/services/reducers/setup-reducer";

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
import { isArrowKey, movePoint, scaleNumber } from "@/utils/helpers";

import {
	DEFAULT_RADIUS,
	DEFAULT_OPACITY,
	DEFAULT_MAX_OPACITY,
} from "@/constants/constants";

import { ImageLayout } from "./components/image-layout/image-layout";
import { TextMatrix } from "./components/text-matrix/text-matrix";

import styles from "./home.module.scss";

// let heatmap: HeatMap;

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

	const [heatmapSettings, setHeatmapSettings] = useState<IHeatmapSettings>({
		radius: DEFAULT_RADIUS,
		opacity: DEFAULT_OPACITY,
		maxOpacity: DEFAULT_MAX_OPACITY,
	} as IHeatmapSettings);

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
	const { currentKey, setupState, matrixImageMapping } = useAppSelector(
		(state) => state.setup
	);

	const handleLayer = (value: number) => {
		setHeatmapSettings((state) => ({
			...state,
			currentLayer: value,
		}));
	};

	const handleRadius = (value: number) => {
		setHeatmapSettings((state) => ({
			...state,
			radius: value,
		}));
	};

	const handleOpacity = (value: number) => {
		setHeatmapSettings((state) => ({
			...state,
			opacity: value,
		}));
	};

	const handleMaxOpacity = (value: number) => {
		setHeatmapSettings((state) => ({
			...state,
			maxOpacity: value,
		}));
	};

	const [canvasContext, setCanvasContext] =
		useState<CanvasRenderingContext2D>();

	const [heatmapData, setHeatmapData] = useState<IHeatMapData[]>([]);

	// init heatmapjs
	useEffect(() => {
		if (!heatmap && heatmapInit) {
			setHeatmap(
				new HeatMap({
					container: heatmapInit.container,
					width: heatmapInit.width,
					height: heatmapInit.height,
					gradient: {
						0.1: "pink",
						0.8: "purple",
					},
				})
			);
		}
	}, [heatmapInit]);

	useEffect(() => {
		if (heatmap && heatmapData[heatmapSettings.currentLayer]) {
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
				gradient: heatmapSettings.gradient,
			});
			// heatmap.config.gradient = heatmapSettings.colors;

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

			//setDefaultParameters
			const configHeatmapSettings = isConfig.heatmapSettings;
			if (configHeatmapSettings) {
				setHeatmapSettings(configHeatmapSettings);
			} else {
				setHeatmapSettings({
					radius: DEFAULT_RADIUS,
					opacity: DEFAULT_OPACITY,
					maxOpacity: DEFAULT_MAX_OPACITY,
					currentLayer: 0,
					gradient: {
						0.1: "violet",
						0.9: "red",
					},
				});
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

	const handleCsvFile = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) return;
		const reader = new FileReader();
		const file = event.target.files[0];

		reader.onload = () => {
			Papa.parse<[]>(file, {
				worker: true,
				dynamicTyping: true,
				skipEmptyLines: "greedy",

				complete: function (results) {
					event.target.value = "";

					setHeatmapData(processCsv(results.data, matrixImageMapping));
				},
			});
		};
		reader.readAsText(file);
	};

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
		<div className={styles.home}>
			{renderImageLayout && (
				<>
					<ImageLayout
						canvasContext={canvasContext}
						setCanvasContext={setCanvasContext}
						setConfig={setConfig}
						keyboardOverlayRef={keyboardOverlayRef}
						updateHeatmapConfig={updateHeatmapConfig}
					/>
					{renderControls && (
						<>
							<div className={styles.controls}>
								<div className={styles.item}>
									<div className={styles["text__items"]}>
										<p>radius</p>
										<p>{heatmapSettings.radius}</p>
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
										<p>opacity</p>
										<p>{heatmapSettings.opacity}</p>
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
										<p>fingers opacity</p>
										<p>{heatmapSettings.maxOpacity}</p>
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
										<p>layer</p>
										<p>{heatmapSettings.currentLayer}</p>
									</div>
									<SimpleSlider
										min={0}
										max={heatmapData.length - 1}
										value={heatmapSettings.currentLayer}
										onChange={handleLayer}
									/>
								</div>
							</div>
						</>
					)}
					{!renderTextArea && (
						<div className={`${styles["file-input"]} noselect`}>
							<input
								type="file"
								id="file"
								accept=".csv"
								className={styles.file}
								onChange={handleCsvFile}
							/>
							<label htmlFor="file">Upload keylog file</label>
						</div>
					)}
				</>
			)}
			{renderTextArea && <TextMatrix />}
		</div>
	);
}
