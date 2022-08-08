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
					<a
						className={`${styles.item} noselect`}
						href="https://github.com/maslomeister/easyheatmap/issues"
						target="_blank"
						rel="noreferrer"
					>
						Report bug
					</a>
					<a
						className={`${styles.item} noselect`}
						href="https://github.com/maslomeister/easyheatmap/issues"
						target="_blank"
						rel="noreferrer"
					>
						Suggest Feature
					</a>
				</div>
			</div>
		</div>
	);
}
