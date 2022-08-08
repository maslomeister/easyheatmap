import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import styles from "./color-card.module.scss";

interface IColorCard {
	id: string;
	item: IGradient;
	handle: boolean;
	removeItem: (id: string) => void;
	setShowColorPicker?: (item: IGradient) => void;
}

export function ColorCard({
	id,
	item,
	removeItem,
	setShowColorPicker,
}: IColorCard) {
	const handleItemRemove = () => {
		if (setShowColorPicker) {
			setShowColorPicker({} as IGradient);
		}

		removeItem(id);
	};

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
				style={handlerStyle}
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
