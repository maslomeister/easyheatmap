import { NavLink } from "react-router-dom";

import { Logo } from "../../assets/icons/logo";

import styles from "./navbar.module.scss";

export function Navbar() {
	return (
		<div className={styles.navbar}>
			<a className={`${styles.logo}  noselect`} href="/">
				<Logo width={48} height={48} />
				<div className={styles["logo-text"]}>
					Easy heatmap <span className={styles["log-sub-text"]}>for qmk</span>
				</div>
			</a>
			<div className={styles.menu}>
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
				<NavLink
					className={({ isActive }) =>
						`${styles.item} ${isActive ? styles.active : ""} noselect`
					}
					to="/settings"
				>
					Settings
				</NavLink>
			</div>
		</div>
	);
}
