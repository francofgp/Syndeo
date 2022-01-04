import React from "react";
import { Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import font from "../../data/PDF/Fuentes/Roboto-Bold.ttf";
Font.register({
	family: "Roboto",
	src: font,
});
const styles1 = StyleSheet.create({
	myText: {
		fontFamily: "Roboto",
	},
});
const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: "row",
		marginTop: 24,
	},
	reportTitle: {
		color: "#61dafb",
		letterSpacing: 4,
		fontSize: 25,
		textAlign: "center",
		textTransform: "uppercase",
	},
});

const TituloPDF = ({ title }) => (
	<View style={styles.titleContainer}>
		<Text style={styles1.myText}>{title} </Text>
	</View>
);

export default TituloPDF;
