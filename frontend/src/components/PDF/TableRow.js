import React, { Fragment } from "react";
import { Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import font from "../../data/PDF/Fuentes/Roboto-Regular.ttf";
//const font = require("./OpenSans-Light.ttf");
/* Font.register({
	family: "Open Sans",
	src: font,
}); */
Font.register({
	family: "Roboto",
	src: font,
});

const styles1 = StyleSheet.create({
	page: {
		fontFamily: "Roboto",
		flexDirection: "row",
		borderBottomColor: "#bff0fd",
		borderBottomWidth: 1,
		alignItems: "center",
		height: 24,
		/*fontStyle: "bold"  */ //Esto da error si lo dejamos
	},
});
const borderColor = "#90e5fc";

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		borderBottomColor: "#bff0fd",
		borderBottomWidth: 1,
		alignItems: "center",
		height: 24,
		fontStyle: "bold",
	},
	palabra: {
		width: "50%",
		textAlign: "left",
		borderRightColor: borderColor,
		borderRightWidth: 1,
		paddingLeft: 8,
	},

	traduccion: {
		width: "50%",
		textAlign: "left",
		paddingRight: 8,
		paddingLeft: 8,
	},
});

const TableRow = ({ filasData }) => {
	const rows = filasData.map((item) => (
		<View style={styles1.page} key={item.id.toString()}>
			<Text style={styles.palabra}>{item.palabra} </Text>
			{/* 
			<Text style={styles.qty}>{item.qty}</Text>
			<Text style={styles.rate}>{item.rate}</Text>*/}
			<Text style={styles.traduccion}>
				{item.traduccion ? item.traduccion : " "}
			</Text>
		</View>
	));
	return <Fragment>{rows}</Fragment>;
};

export default TableRow;
