import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
	invoiceNoContainer: {
		flexDirection: "row",
		marginTop: 36,
		justifyContent: "flex-end",
	},
	invoiceDateContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	invoiceDate: {
		fontSize: 12,
		fontStyle: "bold",
	},
	label: {
		width: 60,
	},
});

var fechaActual = () => {
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, "0");
	var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	var yyyy = today.getFullYear();

	today = dd + "/" + mm + "/" + yyyy;
	return today;
};
const DescripcionPDF = ({ datos }) => (
	<Fragment>
		<View style={styles.invoiceDateContainer}>
			<Text style={styles.label}></Text>
			<Text style={styles.invoiceDate}>{fechaActual()}</Text>
		</View>
	</Fragment>
);

export default DescripcionPDF;
