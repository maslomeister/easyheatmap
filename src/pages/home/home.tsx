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
// import { styled } from "@mui/material/styles";
// import Slider from "@mui/material/Slider";
// import Box from "@mui/material/Box";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select, { SelectChangeEvent } from "@mui/material/Select";
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
import { isArrowKey, movePoint } from "@/utils/helpers";

import { ImageLayout } from "./components/image-layout/image-layout";
import { TextMatrix } from "./components/text-matrix/text-matrix";

import styles from "./home.module.scss";

let heatmap: HeatMap;

export function Home() {
	const [opacity, setOpacity] = useState(1);
	const [radius, setRadius] = useState(20);
	const [maxOpacity, setMaxOpacity] = useState(255);
	const [minOpacity, setMinOpacity] = useState(0);

	const [currentLayer, setCurrentLayer] = useState(0);

	const handleLayer = (value: number | number[]) => {
		if (typeof value === "number") {
			setCurrentLayer(value);
		}
	};

	const handleRaidus = (value: number | number[]) => {
		if (typeof value === "number") {
			setRadius(value);
		}
	};

	const handleOpacity = (value: number | number[]) => {
		if (typeof value === "number") {
			setOpacity(value);
		}
	};

	const handleMaxOpacity = (value: number | number[]) => {
		if (typeof value === "number") {
			setMaxOpacity(value);
		}
	};

	const handleMinOpacity = (value: number | number[]) => {
		if (typeof value === "number") {
			setMinOpacity(value);
		}
	};

	const [layer, setLayer] = React.useState("");

	const handleLayerChange = (event: any) => {
		setLayer(event.target.value as string);
	};

	const keyboardOverlayRef = useRef<HTMLDivElement>(null);
	const [isConfig, setConfig] = useLocalStorage<IConfig>(
		"config",
		{} as IConfig
	);

	const dispatch = useAppDispatch();
	const {
		currentKey,
		keyboardImage,
		textRepresentation,
		setupState,
		matrixImageMapping,
	} = useAppSelector((state) => state.setup);

	// const CustomSlider = styled(Slider)(({ theme }) => ({
	// 	color: "#4a5a75", //color of the slider between thumbs
	// 	"& .MuiSlider-thumb": {
	// 		backgroundColor: "#4a5a75", //color of thumbs
	// 	},
	// 	"& .MuiSlider-rail": {
	// 		color: "#272727", ////color of the slider outside  teh area between thumbs
	// 	},
	// }));

	// const keyboardOverlayRef = useRef<HTMLDivElement>(null);

	// const keyboardLayerRef = useRef<HTMLDivElement>(null);
	// const canvasRef = useRef<HTMLCanvasElement>(null);
	// const textAreaRef = useRef<HTMLTextAreaElement>(null);
	// const textAreaContainerRef = useRef<HTMLDivElement>(null);

	const [canvasContext, setCanvasContext] =
		useState<CanvasRenderingContext2D>();

	// const setCanvasContext = (context: CanvasRenderingContext2D) => {
	// 	// console.log(context);
	// 	setCanvasContextState(context);
	// };

	const [heatmapConfig, setHeatmapConfig] = useState<IHeatmapConfig>({
		container: undefined,
		maxOpacity: 1,
		// minOpacity: 0.05,
		// maxOpacity: 0.6,
		radius: 50,
		blur: 1,
		width: 0,
		height: 0,
		gradient: {
			// enter n keys between 0 and 1 here
			// for gradient color customization
			// 0.9: "red",
			// 0.1: "green",
			// 0.21: "blue",
			// 0.1: "red",
			// 0.1: "black",
			// 0.4: "pink",
			// 1: "purple",
			// 0: "black",
			// 0.8: "pink",
			// 0.45: "pink",
			// 0.55: "pink",
			// 0.3: "#4a5976",
			// 0.5: "#4a5976",
			0: "#4a5976",
			1: "#a7285a",
			// 0: "#a7285a",
			// 1: "#4a5976",
			// 0.2: "pink",
			// 0.6: "purple",
		},
	});
	const [heatmapData, setHeatmapData] = useState<Record<number, IHeatMapData>>(
		{}
	);

	useEffect(() => {
		if (heatmap) {
			heatmap.store.radius = radius;
			heatmap.setData({
				max: heatmapData[currentLayer].maxKeyPresses,
				data: heatmapData[currentLayer].dataPoints,
			});
		}
	}, [radius]);

	useEffect(() => {
		if (heatmap) {
			heatmap.renderer.canvas.style.opacity = opacity.toString();
			heatmap.setData({
				max: heatmapData[currentLayer].maxKeyPresses,
				data: heatmapData[currentLayer].dataPoints,
			});
		}
	}, [opacity]);

	useEffect(() => {
		if (heatmap) {
			// console.log(heatmap.renderer.minOpacity);
			heatmap.renderer.minOpacity = minOpacity;
			heatmap.setData({
				max: heatmapData[currentLayer].maxKeyPresses,
				data: heatmapData[currentLayer].dataPoints,
			});
		}
	}, [minOpacity]);

	useEffect(() => {
		if (heatmap) {
			// console.log(heatmap.renderer.maxOpacity);
			heatmap.renderer.maxOpacity = maxOpacity;
			heatmap.setData({
				max: heatmapData[currentLayer].maxKeyPresses,
				data: heatmapData[currentLayer].dataPoints,
			});
		}
	}, [maxOpacity]);

	useEffect(() => {
		if (heatmap) {
			console.log(currentLayer);
			if (!heatmapData[currentLayer]) return;
			// heatmap.renderer.maxOpacity = maxOpacity;
			heatmap.setData({
				max: heatmapData[currentLayer].maxKeyPresses,
				data: heatmapData[currentLayer].dataPoints,
			});
		}
	}, [currentLayer]);

	// const handleRadius = (event: Event, newValue: number | number[]) => {
	// 	setRadius(newValue as number);
	// };

	// const handleOpacity = (event: Event, newValue: number | number[]) => {
	// 	setOpacity(newValue as number);
	// };

	useEffect(() => {
		if (heatmapData[0] && canvasContext) {
			if (!heatmap) {
				console.log("heatmapConfig", heatmapConfig);
				heatmap = new HeatMap(heatmapConfig);
				// console.log(heatmap);
			} else {
				heatmap.repaint();
			}
			const dataPoints = heatmapData[currentLayer];
			heatmap.setData({
				max: dataPoints.maxKeyPresses,
				data: dataPoints.dataPoints,
			});
			heatmap.repaint();
			console.log(heatmap);
			// setHeatmapPresent(true);
		}
	}, [heatmapData]);

	useEffect(() => {
		if (heatmap && heatmapConfig) {
			console.log(keyboardOverlayRef);
			heatmap.renderer.radius = heatmapConfig.radius!;
			heatmap.repaint();
			console.log("repaint");
		}
	}, [heatmapConfig]);

	// const handleChangeHeatmap = (config: IHeatmapConfig) => {
	// 	setHeatmapConfig({ ...heatmapConfig, radius: config.radius });
	// };

	useEffect(() => {
		if (isConfig.matrixImageMapping && isConfig.keyboardImage) {
			dispatch(setKeyboardImage(isConfig.keyboardImage));
			dispatch(setMatrixImageMapping(isConfig.matrixImageMapping));
			dispatch(setSetupState("logfileUpload"));
		}
	}, []);

	const updateHeatmapConfig = (
		container: HTMLDivElement,
		width: number,
		height: number
	) => {
		setHeatmapConfig({
			...heatmapConfig,
			container,
			width,
			height,
		});
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
			const keycode = event.code;
			console.log(keycode);

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
		[canvasContext, currentKey.x, currentKey.y, matrixImageMapping]
	);

	useEffect(() => {
		window.addEventListener("keydown", checkArrowPress);

		return () => {
			window.removeEventListener("keydown", checkArrowPress);
		};
	}, [canvasContext, currentKey, matrixImageMapping]);

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
									<p>radius</p>
									<Slider
										min={10}
										max={100}
										value={radius}
										onChange={handleRaidus}
										// railStyle={{
										// 	height: 2,
										// }}
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
									{/* <CustomSlider
										value={radius}
										min={10}
										max={100}
										step={1}
										onChange={handleRadius}
									/> */}
								</div>
								<div className={styles.item}>
									<p>opacity</p>
									<Slider
										min={0}
										step={0.05}
										max={1}
										value={opacity}
										onChange={handleOpacity}
										// railStyle={{
										// 	height: 2,
										// }}
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
								</div>
								<div className={styles.item}>
									<p>max opacity</p>
									<Slider
										min={0}
										max={255}
										value={maxOpacity}
										onChange={handleMaxOpacity}
										// railStyle={{
										// 	height: 2,
										// }}
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
								</div>
								<div className={styles.item}>
									<p>min opacity</p>
									<Slider
										min={0}
										max={255}
										value={minOpacity}
										onChange={handleMinOpacity}
										// railStyle={{
										// 	height: 2,
										// }}
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
								</div>
								<div className={styles.item}>
									<p>layer</p>
									<Slider
										min={0}
										step={1}
										max={5}
										value={currentLayer}
										onChange={handleLayer}
										// railStyle={{
										// 	height: 2,
										// }}
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
