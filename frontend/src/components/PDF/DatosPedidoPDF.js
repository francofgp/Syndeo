import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
	headerContainer: {
		marginTop: 36,
	},
	billTo: {
		marginTop: 20,
		paddingBottom: 3,
		fontFamily: "Helvetica-Oblique",
	},
});

const DatosPedidoPDF = ({ datos }) => (
	<View style={styles.headerContainer}>
		{/* <Text style={styles.billTo}>Para:</Text> */}
		<Text>{datos.nombre}</Text>
		<Text>{datos.email}</Text>
		<Text>Idioma: {datos.idioma}</Text>
		<Text>Cantidad de Palabras: {datos.cantidadDePalabras}</Text>
	</View>
);

export default DatosPedidoPDF;
