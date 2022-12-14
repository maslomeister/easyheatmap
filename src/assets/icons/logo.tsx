interface Props {
	width?: number;
	height?: number;
	color?: string;
}
export function Logo({ width, height, color = "#fff" }: Props) {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 48 48"
			version="1"
			xmlns="http://www.w3.org/2000/svg"
			enableBackground="new 0 0 48 48"
		>
			<polygon fill="#46acff" points="9,39 9,6 7,6 7,41 42,41 42,39" />
			<g fill={color}>
				<circle cx="14" cy="11" r="2" />
				<circle cx="32" cy="11" r="2" />
				<circle cx="39" cy="11" r="2" />
				<circle cx="23" cy="11" r="4" />
				<circle cx="14" cy="33" r="2" />
				<circle cx="30" cy="33" r="2" />
				<circle cx="22" cy="33" r="3" />
				<circle cx="38" cy="33" r="4" />
				<circle cx="14" cy="22" r="2" />
				<circle cx="39" cy="22" r="2" />
				<circle cx="32" cy="22" r="3" />
			</g>
		</svg>
	);
}
