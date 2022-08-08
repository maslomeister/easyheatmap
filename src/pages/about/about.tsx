import styles from "./about.module.scss";

export function About() {
	return (
		<div className={styles.about}>
			<section>
				<h1>About:</h1>
				<p>
					This website is heavily inspired by the work of{" "}
					<a className="span-link" href={"https://github.com/precondition"}>
						precondition
					</a>{" "}
					and his{" "}
					<a
						className="span-link"
						href={"https://precondition.github.io/qmk-heatmap"}
					>
						{" "}
						creation
					</a>
					, but his heatmap generator was missing some features, so i&apos;ve
					implemented them in this tool
				</p>
				<br />
				<h2>Key features:</h2>
				<ul>
					<p>You need to map your text matrix to image only once</p>
					<p>You can customize the look of your heatmap however you like</p>
					<p>Any changes to your heatmap design are saved locally</p>
				</ul>

				<p>
					The log file that you upload is not sent anywhere, but you can always
					built this tool from source and use it locally if you like
				</p>
			</section>
		</div>
	);
}
