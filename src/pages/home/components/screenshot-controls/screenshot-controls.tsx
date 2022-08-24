import React, { useMemo } from "react";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";

import { useAppDispatch, useAppSelector } from "@/services/hooks";
import { setScreenshotSettings } from "@/services/reducers/setup-reducer";

import styles from "./screenshot-controls.module.scss";

export function ScreenshotControls() {
	const dispatch = useAppDispatch();

	const { heatmapData, screenshotSetting } = useAppSelector(
		(state) => state.setup
	);

	const setShowHotnessScale = () => {
		dispatch(
			setScreenshotSettings({
				...screenshotSetting,
				showHotnessScale: !screenshotSetting.showHotnessScale,
			})
		);
	};

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
						<p className={styles.title}>Screenshot settings</p>
						<div className={styles["item-checkbox"]}>
							<p>hotness scale</p>
							<input
								type="checkbox"
								name="happy"
								checked={screenshotSetting.showHotnessScale}
								onChange={setShowHotnessScale}
							/>
						</div>
					</div>
					<div>
						<div className={styles["save-screenshot"]} onClick={saveScreenshot}>
							<p>save screenshot</p>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
