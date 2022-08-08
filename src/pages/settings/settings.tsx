import { useLocalStorage } from "usehooks-ts";

import styles from "./settings.module.scss";

export function Settings() {
	const [isConfig, setConfig] = useLocalStorage<IConfig>(
		"config",
		{} as IConfig
	);

	// useEffect(() => {

	// },)

	return <div className={styles["settings"]}>Settings</div>;
}
