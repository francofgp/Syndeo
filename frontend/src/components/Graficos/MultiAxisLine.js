import React from "react";
import { Line } from "react-chartjs-2";

const options = {
	responsive: true,
	scales: {
		/* yAxes: [
			{
				type: "linear",
				display: true,
				position: "left",
				id: "y-axis-1",
			},
			{
				type: "linear",
				display: true,
				position: "right",
				id: "y-axis-2",
				gridLines: {
					drawOnArea: false,
					drawBorder: false,
				},
			},
		], */
	},
};

const MultiAxisLine = ({ data, titulo }) => (
	<>
		<div className="header">
			<h3 className="title">{titulo}</h3>
			<div className="links">
				{/* <a
					className="btn btn-gh"
					href="https://github.com/reactchartjs/react-chartjs-2/blob/master/example/src/charts/MultiAxisLine.js"
				>
					Github Source
				</a> */}
			</div>
		</div>
		<Line data={data} options={options} />
	</>
);

export default MultiAxisLine;
