import { Routes, Route } from "react-router-dom";

import { Navbar } from "../navbar/navbar";
import { Footer } from "../footer/footer";

import { Home } from "pages/home/home";
import { About } from "pages/about/about";
import { HowToUse } from "@/pages/how-to-use/how-to-use";
import { Settings } from "pages/settings/settings";
import { SupportMe } from "pages/support-me/support-me";

import styles from "./app.module.scss";

export function App() {
	return (
		<div className={styles.app}>
			<Navbar />
			<div className={styles.content}>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/how-to-use" element={<HowToUse />} />
					<Route path="/settings" element={<Settings />} />
					<Route path="/support-me" element={<SupportMe />} />
				</Routes>
			</div>
			<Footer />
		</div>
	);
}
