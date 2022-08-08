import React, { useRef, useState, useMemo } from "react";

import { getMatrixKeys } from "@/utils/matrixUtils";

import { useAppDispatch, useAppSelector } from "@/services/hooks";
import {
	setNextKey,
	setMatrixArray,
	setTextRepresentation,
	setTextAreaSize,
	setSetupState,
} from "@/services/reducers/setup-reducer";

import styles from "./text-matrix.module.scss";

export function TextMatrix() {
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const textAreaContainerRef = useRef<HTMLDivElement>(null);

	const [error, setError] = useState("");

	const dispatch = useAppDispatch();
	const {
		nextKey,
		textRepresentation,
		textAreaSize,
		keyboardImage,
		matrixArray,
		matrixImageMapping,
	} = useAppSelector((state) => state.setup);

	const resizeOnInputChange = () => {
		const textAreaElem = textAreaRef.current;
		const textAreaContainerElem = textAreaContainerRef.current;

		if (!textAreaElem || !textAreaContainerElem) return;

		if (textAreaElem.scrollWidth > textAreaElem.clientWidth) {
			textAreaElem.style.margin = "0";
			textAreaElem.style.width = textAreaElem.scrollWidth + "px";
			textAreaContainerElem.style.width = textAreaElem.scrollWidth - 50 + "px";
		}

		if (textAreaElem.scrollHeight > textAreaElem.clientHeight) {
			textAreaElem.style.height = textAreaElem.scrollHeight + "px";
			textAreaContainerElem.style.height =
				textAreaElem.scrollHeight + 24 + "px";
		}

		dispatch(
			setTextAreaSize({
				width: textAreaElem.scrollWidth,
				height: textAreaElem.scrollHeight,
			})
		);
		dispatch(setSetupState("imageUpload"));
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setError("");
		const matrixKeys = getMatrixKeys(event.target.value);
		const textAreaVal = event.target.value;
		if (!matrixKeys.allowed) {
			event.target.value = "";
			setError("Incorrect text matrix, try again");
			return;
		}
		dispatch(setMatrixArray(getMatrixKeys(event.target.value).matrix));
		resizeOnInputChange();

		const lines = textAreaVal.split("\n");

		let text = "";
		for (let i = 0; i < lines.length; i++) {
			text += `<pre class="pre">${lines[i]}<br></pre>`;
		}
		matrixKeys.matrix.map((item) => {
			text = text.replace(item, `<span class="regular-key">${item}</span>`);
		});

		dispatch(setTextRepresentation(text));
		dispatch(setNextKey(matrixKeys.matrix[0]));
	};

	const isTextMatrixFinished = useMemo(() => {
		if (matrixArray.length == 0 && matrixImageMapping.length > 0) {
			return true;
		}
		return false;
	}, [matrixImageMapping, matrixArray]);

	return (
		<>
			{keyboardImage.src && (
				<div className={styles["current-key-helper"]}>
					{isTextMatrixFinished ? (
						<>
							<p className="noselect">
								<span className={styles["highlighted-text"]}> Click </span>{" "}
								anywhere on the image to
								<span className={styles["highlighted-text"]}> continue </span>
							</p>
						</>
					) : (
						<>
							<p className="noselect">
								Click the key on picture that corresponds to{" "}
								<span className={styles["active-key"]}>{nextKey}</span>
							</p>
							<p className="subtext noselect">
								Hold <span className={styles["highlighted-text"]}> shift </span>{" "}
								and click on picture to remove last selected key, use
								<span className={styles["highlighted-text"]}> ESDF </span> to to
								correct position
							</p>
						</>
					)}
				</div>
			)}
			<div className={styles["textarea-container"]}>
				<div className={styles["textarea-wrapper"]} ref={textAreaContainerRef}>
					{!textRepresentation && (
						<textarea
							onChange={handleInputChange}
							className={styles.textarea}
							placeholder="// Paste qmk info -kb <name> -m results here"
							rows={2}
							cols={42}
							ref={textAreaRef}
						/>
					)}
					{textRepresentation && (
						<div
							className="noselect"
							style={{
								width: textAreaSize.width,
								height: textAreaSize.height,
							}}
							dangerouslySetInnerHTML={{ __html: textRepresentation }}
							key={nextKey}
						/>
					)}
				</div>
				<p style={{ marginTop: "24px", color: "var(--error-color)" }}>
					{error}
				</p>
			</div>
		</>
	);
}
