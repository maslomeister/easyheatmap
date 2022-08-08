import { useState, useEffect, useMemo } from "react";
import {
	DndContext,
	closestCenter,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
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
	addNewColor,
	getNewValues,
	changeColor,
} from "@/utils/colorArrayHelpers";

import { BiPlus } from "react-icons/bi";
import { ColorCard } from "./components/color-card/color-card";

import styles from "./colors-array.module.scss";

interface IColorsArray {
	gradient: IGradient[];
	updateGradient: (gradient: IGradient[]) => void;
}

interface IShowColorPickers {
	id: string;
	value: boolean;
}

export function ColorsArray({ gradient, updateGradient }: IColorsArray) {
	const [showColorPicker, setShowColorPicker] = useState<IGradient>(
		{} as IGradient
	);

	const [activeItem, setActiveItem] = useState<IGradient>({} as IGradient);

	const handleShowColorPicker = (item: IGradient) => {
		setShowColorPicker(item);
		// const previousValue = showColorPickers.filter((item) => item.id === id)[0]
		// 	.value;
		// setShowColorPickers(
		// 	showColorPickers.map((item) =>
		// 		item.id === id ? { ...item, value: !previousValue } : { ...item }
		// 	)
		// );
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
		const color = gradient[gradient.length - 1].color;
		updateGradient(addNewColor(gradient, color));
	};
	const removeItem = (id: string) => {
		updateGradient(removeColorWithId(gradient, id));
	};

	// const color = useMemo(() => {
	// 	if (activeItem) {
	// 		setShowColorPickers(true);
	// 	}
	// }, [activeItem]);

	// const changeColor = (id: string, color: string) => {
	// 	updateGradient(gradient.map((item) => (item === id ? color : item)));
	// };

	// function handleDragEnd(event: DragEndEvent) {
	// 	const { active, over } = event;

	// 	if (over && active.id !== over.id && gradient.length > 0) {
	// 		const oldIndex = gradient.findIndex((item) => item.id === active.id);
	// 		const newIndex = gradient.findIndex((item) => item.id === over.id);
	// 		// return arrayMove(items, oldIndex, newIndex);
	// 		// setItems((items) => {
	// 		// 	const oldIndex = items.indexOf(active.id as string);
	// 		// 	const newIndex = items.indexOf(over.id as string);
	// 		// 	return arrayMove(items, oldIndex, newIndex);
	// 		// });
	// 		updateGradient(getNewValues(arrayMove(gradient, oldIndex, newIndex)));
	// 	}
	// }

	const handleDragStart = (event: DragStartEvent) => {
		const item = gradient.filter((item) => item.id === event.active.id)[0];
		setActiveItem(item);
	};

	function handleDragMove(event: DragMoveEvent) {
		const { active, over } = event;
		if (over && active.id !== over.id && gradient.length > 0) {
			const oldIndex = gradient.findIndex((item) => item.id === active.id);
			const newIndex = gradient.findIndex((item) => item.id === over.id);
			// return arrayMove(items, oldIndex, newIndex);
			// setItems((items) => {
			// 	const oldIndex = items.indexOf(active.id as string);
			// 	const newIndex = items.indexOf(over.id as string);
			// 	return arrayMove(items, oldIndex, newIndex);
			// });
			updateGradient(getNewValues(arrayMove(gradient, oldIndex, newIndex)));
		}
	}

	const handleDragEnd = (event: DragEndEvent) => {
		setActiveItem({} as IGradient);
		// const { active, over } = event;

		// if (active.id !== over.id) {
		// 	setItems((items) => {
		// 		const oldIndex = items.indexOf(active.id);
		// 		const newIndex = items.indexOf(over.id);

		// 		return arrayMove(items, oldIndex, newIndex);
		// 	});
		// }
	};

	// const showColorPickerValue = useMemo((id) => () => {}, [showColorPickers]);

	// const showColorPickerValue = useMemo(() => {
	// 	if (showColorPickers.length > 0) {
	// 		return showColorPickers.filter((item) => item.id === id)[0];
	// 	} else {
	// 		return false;
	// 	}
	// }, [showColorPickers]);

	// console.log(heatmapSettings.gradient);
	return (
		<DndContext
			// collisionDetection={closestCenter}
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
								setShowColorPicker={handleShowColorPicker}
								// changeColor={changeColor}
								// setShowColorPicker={handleShowColorPicker}
								// showColorPicker={
								// 	showColorPickers.length > 0
								// 		? showColorPickers.filter((state) => state.id === item)[0]
								// 				.value
								// 		: false
								// }
							/>
						))}
						<DragOverlay>
							{activeItem.color ? (
								<ColorCard
									id={"xd"}
									item={activeItem}
									handle={true}
									removeItem={removeItem}
									// changeColor={changeColor}
									// setShowColorPicker={handleShowColorPicker}
									// showColorPicker={
									// 	showColorPickers.length > 0
									// 		? showColorPickers.filter((state) => state.id === item)[0]
									// 				.value
									// 		: false
									// }
								/>
							) : (
								<p>xd</p>
							)}
						</DragOverlay>
						{/* <ColorCard add /> */}
					</SortableContext>
				</div>
				{showColorPicker.color && (
					<div className={styles["color-picker-container"]}>
						<HexColorPicker color={showColorPicker.color} onChange={setColor} />
					</div>
				)}
			</div>
		</DndContext>
	);
}
