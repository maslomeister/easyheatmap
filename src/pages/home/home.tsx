import React, { useEffect, useState, useRef, useMemo } from "react";
import HeatMap from "heatmap-ts";

import { useLocalStorage } from "usehooks-ts";

import { useAppDispatch, useAppSelector } from "@/services/hooks";
import {
	setKeyboardImage,
	setMatrixImageMapping,
	setSetupState,
	updateHeatmapSettings,
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

import { HeatmapControls } from "./components/heatmap-controls/heatmap-controls";
import { ScreenshotControls } from "./components/screenshot-controls/screenshot-controls";
import { ImageLayout } from "./components/image-layout/image-layout";
import { TextMatrix } from "./components/text-matrix/text-matrix";

import styles from "./home.module.scss";

export function Home() {
	const keyboardOverlayRef = useRef<HTMLDivElement>(null);

	const [heatmap, setHeatmap] = useState<HeatMap>();

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
	const { heatmapData, heatmapSettings, setupState } = useAppSelector(
		(state) => state.setup
	);

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

	return (
		<div className={styles.home}>
			{renderImageLayout && (
				<div className={styles["view-heatmap"]}>
					<HeatmapControls />
					<ImageLayout
						canvasContext={canvasContext}
						setCanvasContext={setCanvasContext}
						setConfig={setConfig}
						keyboardOverlayRef={keyboardOverlayRef}
						updateHeatmapConfig={updateHeatmapConfig}
					/>
					<ScreenshotControls />
				</div>
			)}
			{renderTextArea && <TextMatrix />}
		</div>
	);
}
