import { useState, useEffect } from "react";
import {
	DndContext,
	DragEndEvent,
	DragStartEvent,
	DragMoveEvent,
	DragOverlay,
} from "@dnd-kit/core";

import {
	restrictToVerticalAxis,
	restrictToWindowEdges,
} from "@dnd-kit/modifiers";

import {
	arrayMove,
	SortableContext,
	rectSortingStrategy,
} from "@dnd-kit/sortable";

import { HexColorPicker } from "react-colorful";

import {
	removeColorWithId,
	duplicateColor,
	addNewColor,
	getNewValues,
	changeColor,
} from "@/utils/colorArrayHelpers";

import { BiPlus } from "react-icons/bi";
import { ColorCard } from "./components/color-card/color-card";

import styles from "./colors-array.module.scss";

interface IColorsArray {
	gradient: IGradient[];
	showColorPicker: IGradient;
	setShowColorPicker: (item: IGradient) => void;
	updateGradient: (gradient: IGradient[]) => void;
}

export function ColorsArray({
	gradient,
	updateGradient,
	showColorPicker,
	setShowColorPicker,
}: IColorsArray) {
	const [activeItem, setActiveItem] = useState<IGradient>({} as IGradient);

	const handleShowColorPicker = (item: IGradient) => {
		setShowColorPicker(item);
	};

	const handleHideColorPicker = () => {
		setShowColorPicker({} as IGradient);
	};

	useEffect(() => {
		if (showColorPicker.color) {
			setShowColorPicker({} as IGradient);
		}
	}, [activeItem]);

	const setColor = (newColor: string) => {
		if (showColorPicker.color) {
			updateGradient(changeColor(gradient, showColorPicker.id, newColor));
		}
	};

	const handleAddNewColor = () => {
		const color = gradient[gradient.length - 1]?.color;
		if (color) {
			updateGradient(addNewColor(gradient, color));
		} else {
			updateGradient(addNewColor(gradient, "#fff"));
		}
	};
	const removeItem = (id: string) => {
		updateGradient(removeColorWithId(gradient, id));
	};
	const duplicateItem = (id: string) => {
		updateGradient(duplicateColor(gradient, id));
	};

	const handleDragStart = (event: DragStartEvent) => {
		const item = gradient.filter((item) => item.id === event.active.id)[0];
		setActiveItem(item);
	};

	function handleDragMove(event: DragMoveEvent) {
		const { active, over } = event;
		if (over && active.id !== over.id && gradient.length > 0) {
			const oldIndex = gradient.findIndex((item) => item.id === active.id);
			const newIndex = gradient.findIndex((item) => item.id === over.id);
			updateGradient(getNewValues(arrayMove(gradient, oldIndex, newIndex)));
		}
	}

	const handleDragEnd = (event: DragEndEvent) => {
		setActiveItem({} as IGradient);
	};

	return (
		<DndContext
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragMove={handleDragMove}
			modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
		>
			<div className={styles["colors-array"]}>
				<div className={styles["add-color-container"]}>
					<p>Colors</p>
					<div className={styles["add-color"]} onClick={handleAddNewColor}>
						<BiPlus size={24} />
					</div>
				</div>

				<div className={styles["color-container"]}>
					<SortableContext items={gradient} strategy={rectSortingStrategy}>
						{gradient.map((item) => (
							<ColorCard
								id={item.id}
								key={item.id}
								item={item}
								handle={true}
								removeItem={removeItem}
								duplicateItem={duplicateItem}
								setShowColorPicker={handleShowColorPicker}
							/>
						))}
						<DragOverlay>
							{activeItem.color ? (
								<ColorCard
									id={"xd"}
									item={activeItem}
									handle={true}
									removeItem={removeItem}
									duplicateItem={duplicateItem}
								/>
							) : (
								<></>
							)}
						</DragOverlay>
					</SortableContext>
				</div>

				{showColorPicker.color && (
					<div className={styles["color-picker-container"]}>
						<HexColorPicker
							className="small"
							color={showColorPicker.color}
							onChange={setColor}
						/>

						<p
							className={styles["color-picker__close"]}
							onClick={handleHideColorPicker}
						>
							close
						</p>
					</div>
				)}
			</div>
		</DndContext>
	);
}
