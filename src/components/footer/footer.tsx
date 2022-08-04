import { Logo } from "@/assets/icons/logo";

import styles from "./footer.module.scss";

export function Footer() {
	return (
		<div className={styles.footer}>
			<a className={styles.logo} href="https://github.com/maslomeister">
				<span> maslomeister © 2022</span>
			</a>
			<div className={styles.menu}>
				<a className={styles.item} href="/">
					Github
				</a>
				<a className={styles.item} href="/">
					Report bug
				</a>
				<a className={styles.item} href="/">
					Suggest Feature
				</a>
			</div>
		</div>
	);
}
