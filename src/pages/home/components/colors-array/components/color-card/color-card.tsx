import React, { useMemo, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { HandleIcon } from "@/assets/icons/handle_icon";
import { ChangeColorIcon } from "@/assets/icons/change_color_icon";

import styles from "./color-card.module.scss";

interface IColorCard {
	id: string;
	item: IGradient;
	handle: boolean;
	removeItem: (id: string) => void;
	// changeColor: (id: string, color: string) => void;
	// showColorPicker: boolean;
	setShowColorPicker?: (item: IGradient) => void;
}

export function ColorCard({
	id,
	item,
	removeItem /* changeColor */,
	setShowColorPicker,
}: IColorCard) {
	// const [showColorPicker, setShowColorPicker] = useState(false);
	// const [colorValue, setColorValue] = useState(color);

	const handleItemRemove = () => {
		if (setShowColorPicker) {
			setShowColorPicker({} as IGradient);
		}

		removeItem(id);
	};

	// const onColorPicked = (color: ColorResult) => {
	// 	changeColor(id, color.hex);
	// };

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? "100" : "auto",
		opacity: isDragging ? 0 : 1,
	};

	const handlerStyle = {
		cursor: isDragging ? "grabbing" : "grab",
	};

	return (
		<div className={styles["color-card"]} ref={setNodeRef} style={style}>
			<span
				className={styles["handler"]}
				{...listeners}
				{...attributes}
				// style={handlerStyle}
			/>
			<span
				className={styles["color-dot"]}
				style={{ backgroundColor: item.color }}
				onClick={() => {
					if (setShowColorPicker) {
						setShowColorPicker(item);
					}
				}}
			/>
			<a className={styles.close} onClick={handleItemRemove} />
		</div>
	);
}
