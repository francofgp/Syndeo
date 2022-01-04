import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "#90e5fc";
const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		borderBottomColor: "#bff0fd",
		backgroundColor: "#bff0fd",
		borderBottomWidth: 1,
		alignItems: "center",
		height: 24,
		textAlign: "center",
		fontStyle: "bold",
		flexGrow: 1,
	},
	palabra: {
		width: "50%",
		borderRightColor: borderColor,
		borderRightWidth: 1,
	},

	traduccion: {
		width: "50%",
	},
});

const TableHeader = () => (
	<View style={styles.container}>
		<Text style={styles.palabra}>Palabra</Text>
		{/* <Text style={styles.qty}>Qty</Text>
		<Text style={styles.rate}>@</Text> */}
		<Text style={styles.traduccion}>Traducción</Text>
	</View>
);

export default TableHeader;
