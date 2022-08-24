import React, { useMemo, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/services/hooks";
import { updateHeatmapSettings } from "@/services/reducers/setup-reducer";

import { SimpleSlider } from "@/components/simple-slider/simple-slider";
import { ColorsArray } from "../colors-array/colors-array";

import styles from "./heatmap-controls.module.scss";

export function HeatmapControls() {
	const dispatch = useAppDispatch();

	const { heatmapData, heatmapSettings } = useAppSelector(
		(state) => state.setup
	);

	const [showColorPicker, setShowColorPicker] = useState<IGradient>(
		{} as IGradient
	);

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

	const renderControls = useMemo(() => {
		if (heatmapData[0]) {
			return true;
		} else {
			return false;
		}
	}, [heatmapData]);

	return (
		<>
			{renderControls && (
				<div className={styles.controls}>
					<div>
						<p>Heatmap controls</p>
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
					<div>
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
					<div>
						<div className={styles["text__items"]}>
							<p className={styles["controls__text"]}>fingers opacity</p>
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
					<div>
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
						setShowColorPicker={setShowColorPicker}
						showColorPicker={showColorPicker}
					/>
				</div>
			)}
		</>
	);
}
