import { Logo } from "@/assets/icons/logo";

import styles from "./footer.module.scss";

export function Footer() {
	return (
		<div className={styles["footer__container"]}>
			<div className={styles.footer}>
				<a
					className={`${styles.logo} noselect`}
					href="https://github.com/maslomeister"
					target="_blank"
					rel="noreferrer"
				>
					<span> maslomeister © 2022</span>
				</a>
				<div className={styles.menu}>
					<a
						className={`${styles.item} noselect`}
						href="https://github.com/maslomeister/easyheatmap"
						target="_blank"
						rel="noreferrer"
					>
						Github
					</a>
					<a className={`${styles.item} noselect`} href="/" target="_blank">
						Report bug
					</a>
					<a className={`${styles.item} noselect`} href="/" target="_blank">
						Suggest Feature
					</a>
				</div>
			</div>
		</div>
	);
}
