import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export function SimpleSlider({
	min,
	max,
	step = 1,
	value,
	onChange,
}: {
	min: number;
	max: number;
	step?: number;
	value: number;
	onChange: (value: number) => void;
}) {
	const handleValue = (value: number | number[]) => {
		if (typeof value === "number") {
			onChange(value);
		}
	};

	return (
		<Slider
			min={min}
			max={max}
			step={step}
			value={value}
			onChange={handleValue}
			handleStyle={{
				height: 18,
				width: 18,
				backgroundColor: "#5071b4",
				opacity: 1,
				border: 0,
			}}
			trackStyle={{
				background: "#4a5976",
			}}
			railStyle={{
				background: "#575555",
			}}
		/>
	);
}
