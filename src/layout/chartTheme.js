const assign = Object.assign;

// Colors
const yellow200 = "#FFF59D";
const deepOrange600 = "#F4511E";
const lime300 = "#DCE775";
const lightGreen500 = "#8BC34A";
const teal700 = "#00796B";
const cyan900 = "#006064";
const colors = [
	deepOrange600,
	yellow200,
	lime300,
	lightGreen500,
	teal700,
	cyan900
];
const blueGrey50 = "#ECEFF1";
const blueGrey300 = "#90A4AE";
const blueGrey700 = "#455A64";
const grey900 = "#212121";
const primaryColor = '#F11761';
const highlightColor = '#902b4d';

// Typography
const sansSerif = "'Roboto', 'Helvetica Neue', Helvetica, sans-serif";
const letterSpacing = "normal";
const fontSize = 8;

// Layout
const padding = 6;
const baseProps = {
	height: 200,
	minHeight: 100,
	padding: 30
};

// * Labels
const baseLabelStyles = {
	fontFamily: sansSerif,
	fontSize,
	letterSpacing,
	padding,
	fill: blueGrey700,
	stroke: "transparent",
	strokeWidth: 0
};

const centeredLabelStyles = assign({ textAnchor: "middle" }, baseLabelStyles);

// Strokes
const strokeDasharray = "10, 5";
const strokeLinecap = "round";
const strokeLinejoin = "round";

// Put it all together...
export default  {
	area: assign(
		{
			style: {
				data: {
					fill: grey900
				},
				labels: centeredLabelStyles
			}
		},
		baseProps
	),
	axis: assign(
		{
			style: {
				axis: {
					fill: "transparent",
					stroke: blueGrey300,
					strokeWidth: 2,
					strokeLinecap,
					strokeLinejoin
				},
				axisLabel: assign({}, centeredLabelStyles, {
					padding,
					stroke: "transparent"
				}),
				grid: {
					fill: "none",
					stroke: blueGrey50,
					strokeDasharray,
					strokeLinecap,
					strokeLinejoin,
					pointerEvents: "painted"
				},
				ticks: {
					fill: "transparent",
					size: 5,
					stroke: blueGrey300,
					strokeWidth: 1,
					strokeLinecap,
					strokeLinejoin
				},
				tickLabels: assign({}, baseLabelStyles, {
					fill: blueGrey700
				})
			}
		},
		baseProps
	),
	bar: assign(
		{
			style: {
				data: {
					fill: primaryColor,
					padding,
					strokeWidth: 0
				},
				labels: baseLabelStyles
			}
		},
		baseProps
	),
	boxplot: assign(
		{
			style: {
				max: {
					padding,
					stroke: blueGrey700,
					strokeWidth: 1
				},
				maxLabels: baseLabelStyles,
				median: {
					padding,
					stroke: blueGrey700,
					strokeWidth: 1
				},
				medianLabels: baseLabelStyles,
				min: {
					padding,
					stroke: blueGrey700,
					strokeWidth: 1
				},
				minLabels: baseLabelStyles,
				q1: {
					padding,
					fill: blueGrey700
				},
				q1Labels: baseLabelStyles,
				q3: {
					padding,
					fill: blueGrey700
				},
				q3Labels: baseLabelStyles
			},
			boxWidth: 20
		},
		baseProps
	),
	candlestick: assign(
		{
			style: {
				data: {
					stroke: blueGrey700
				},
				labels: centeredLabelStyles
			},
			candleColors: {
				positive: "#ffffff",
				negative: blueGrey700
			}
		},
		baseProps
	),
	chart: baseProps,
	errorbar: assign(
		{
			borderWidth: 8,
			style: {
				data: {
					fill: "transparent",
					opacity: 1,
					stroke: blueGrey700,
					strokeWidth: 2
				},
				labels: centeredLabelStyles
			}
		},
		baseProps
	),
	group: assign(
		{
			colorScale: colors
		},
		baseProps
	),
	legend: {
		colorScale: colors,
		gutter: 10,
		orientation: "vertical",
		titleOrientation: "top",
		style: {
			data: {
				type: "circle"
			},
			labels: baseLabelStyles,
			title: assign({}, baseLabelStyles, { padding: 5 })
		}
	},
	line: assign(
		{
			style: {
				data: {
					fill: "transparent",
					opacity: 1,
					stroke: primaryColor,
					strokeWidth: 2,
				},
				labels: centeredLabelStyles
			}
		},
		baseProps
	),
	pie: assign(
		{
			colorScale: colors,
			style: {
				data: {
					padding,
					stroke: blueGrey50,
					strokeWidth: 1
				},
				labels: assign({}, baseLabelStyles, { padding: 20 })
			}
		},
		baseProps
	),
	scatter: assign(
		{
			style: {
				data: {
					fill: highlightColor,
					opacity: 1,
					stroke: "transparent",
					strokeWidth: 0
				},
				labels: centeredLabelStyles
			}
		},
		baseProps
	),
	stack: assign(
		{
			colorScale: colors
		},
		baseProps
	),
	tooltip: {
		style: assign({}, centeredLabelStyles, {
			padding: 5,
			pointerEvents: "none"
		}),
		flyoutStyle: {
			stroke: grey900,
			strokeWidth: 1,
			fill: "#f0f0f0",
			pointerEvents: "none"
		},
		cornerRadius: 5,
		pointerLength: 10
	},
	voronoi: assign(
		{
			style: {
				data: {
					fill: "transparent",
					stroke: "transparent",
					strokeWidth: 0
				},
				labels: assign({}, centeredLabelStyles, {
					padding: 5,
					pointerEvents: "none"
				}),
				flyout: {
					stroke: grey900,
					strokeWidth: 1,
					fill: "#f0f0f0",
					pointerEvents: "none"
				}
			}
		},
		baseProps
	)
};