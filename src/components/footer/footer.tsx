import { Logo } from "@/assets/icons/logo";

import styles from "./footer.module.scss";

export function Footer() {
	return (
		<div className={styles.footer}>
			<a
				className={`${styles.logo} noselect`}
				href="https://github.com/maslomeister"
			>
				<span> maslomeister © 2022</span>
			</a>
			<div className={styles.menu}>
				<a
					className={`${styles.item} noselect`}
					href="https://github.com/maslomeister/heatmap_generator"
				>
					Github
				</a>
				<a className={`${styles.item} noselect`} href="/">
					Report bug
				</a>
				<a className={`${styles.item} noselect`} href="/">
					Suggest Feature
				</a>
			</div>
		</div>
	);
}
