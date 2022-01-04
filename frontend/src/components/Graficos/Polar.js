import React from "react";
import { PolarArea } from "react-chartjs-2";

const Polar = ({ data, titulo }) => (
	<>
		<div className="header">
			<h3 className="title">{titulo}</h3>
			<div className="links">
				<a
					className="btn btn-gh"
					href="https://github.com/reactchartjs/react-chartjs-2/blob/master/example/src/charts/Polar.js"
				>
					{/* Github Source */}
				</a>
			</div>
		</div>
		<PolarArea data={data} />
	</>
);

export default Polar;
