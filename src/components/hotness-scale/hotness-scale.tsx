import { useRef, useEffect } from "react";

import styles from "./hotness-scale.module.scss";

import { useAppSelector } from "@/services/hooks";

export function HotnessScale() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { heatmapSettings, heatmapData } = useAppSelector(
		(state) => state.setup
	);

	useEffect(() => {
		const canvasElem = canvasRef.current;
		if (!canvasElem) return;
		const ctx = canvasElem.getContext("2d");
		if (!ctx) return;

		if (heatmapSettings.gradient.length > 1) {
			const grd = ctx.createLinearGradient(0, 0, 100, 0);
			heatmapSettings.gradient.map((item) =>
				grd.addColorStop(item.value, item.color)
			);
			ctx.fillStyle = grd;
			ctx.fillRect(0, 4, 100, 12);
		}
	}, [heatmapSettings, heatmapData]);

	return (
		<>
			{heatmapData.length > 0 ? (
				<div className={styles["hotness-container"]}>
					<div className={styles["title"]}>
						<p className={`${styles["text"]} subtext`}>HOTNESS</p>
						<p className={`${styles["text"]} subtext`}>SCALE</p>
					</div>
					<div className={styles["hotness-scale"]}>
						<p className="subtext">0%</p>
						<div className={styles["hotness"]}>
							<canvas width={100} height={24} ref={canvasRef}></canvas>
						</div>

						<p className="subtext">100%</p>
					</div>
				</div>
			) : (
				<></>
			)}
		</>
	);
}
