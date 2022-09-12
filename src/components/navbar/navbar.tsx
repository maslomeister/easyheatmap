import { NavLink, matchPath, useLocation } from "react-router-dom";
import Papa from "papaparse";

import { Logo } from "../../assets/icons/logo";

import { useAppDispatch, useAppSelector } from "@/services/hooks";
import {
	setHeatmapData,
	setLoadingCsv,
} from "@/services/reducers/setup-reducer";
import { processCsv } from "@/utils/matrixUtils";

import styles from "./navbar.module.scss";

export function Navbar() {
	const { pathname } = useLocation();
	const home = matchPath(pathname, "/");

	const dispatch = useAppDispatch();
	const { setupState, matrixImageMapping } = useAppSelector(
		(state) => state.setup
	);
	const handleCsvFile = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) return;
		const reader = new FileReader();
		const file = event.target.files[0];

		dispatch(setLoadingCsv(true));
		reader.onload = () => {
			Papa.parse<[]>(file, {
				worker: true,
				dynamicTyping: true,
				skipEmptyLines: "greedy",

				complete: function (results) {
					dispatch(setLoadingCsv(false));
					event.target.value = "";

					dispatch(
						setHeatmapData(processCsv(results.data, matrixImageMapping))
					);
				},
			});
		};
		reader.readAsText(file);
	};

	return (
		<div className={styles.navbar}>
			<a
				className={`${styles.logo}  noselect`}
				href="//maslomeister.github.io/easyheatmap"
			>
				<Logo width={48} height={48} />
				<div className={styles["logo-text"]}>
					Easy heatmap <span className={styles["log-sub-text"]}>for qmk</span>
				</div>
			</a>
			<div className={styles.menu}>
				{setupState === "logfileUpload" && home && (
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
				<NavLink
					className={({ isActive }) =>
						`${styles.item} ${isActive ? styles.active : ""} noselect`
					}
					to="/about"
				>
					About
				</NavLink>
				<NavLink
					className={({ isActive }) =>
						`${styles.item} ${isActive ? styles.active : ""} noselect`
					}
					to="/how-to-use"
				>
					How to use
				</NavLink>
				{/* <NavLink
					className={({ isActive }) =>
						`${styles.item} ${isActive ? styles.active : ""} noselect`
					}
					to="/settings"
				>
					Settings
				</NavLink> */}
			</div>
		</div>
	);
}
