import React from "react";
import { Bar } from "react-chartjs-2";

const options = {
	responsive: true,
	scales: {
		yAxes: [
			{
				ticks: {
					beginAtZero: true,
				},
			},
		],
	},
};

const VerticalBar = ({ data, titulo }) => (
	<>
		<div className="header">
			<h3 className="title">{titulo}</h3>
			<div className="links">
				{/* <a
					className="btn btn-gh"
					href="https://github.com/reactchartjs/react-chartjs-2/blob/master/example/src/charts/VerticalBar.js"
				>
					Github Source
				</a> */}
			</div>
		</div>
		<Bar data={data} options={options} />
	</>
);

export default VerticalBar;
