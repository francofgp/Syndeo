import React from "react";
import { Page, Document, Image, StyleSheet, Font } from "@react-pdf/renderer";
import TituloPDF from "./TituloPDF";
import DatosPedidoPDF from "./DatosPedidoPDF";
import DescripcionPDF from "./DescripcionPDF";
import ItemsTable from "./ItemsTable";
import MensajeFinalPDF from "./MensajeFinalPDF";
//import logoPDF from "../../data/PDF/logoPDF.jpg";
import logoPDF from "../../data/imagenesLogoSyndeo/SYNDEO LOGO PDF.jpg";

Font.register({
	family: "Roboto",
	src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
});
const styles = StyleSheet.create({
	page: {
		fontFamily: "Helvetica",
		fontSize: 11,
		paddingTop: 30,
		paddingLeft: 60,
		paddingRight: 60,
		lineHeight: 1.5,
		flexDirection: "column",
	},
	logo: {
		width: 350,
		height: "auto",
		marginLeft: "auto",
		marginRight: "auto",
	},
});

const MainPDF = ({ datosTabla, filasData }) => (
	<Document>
		<Page size="A4" style={styles.page}>
			<Image style={styles.logo} src={logoPDF} />
			<TituloPDF title="" />
			<DescripcionPDF datos={datosTabla} />
			<DatosPedidoPDF datos={datosTabla} />
			<ItemsTable filasData={filasData} datosTabla={datosTabla} />
			<MensajeFinalPDF contenido="¡Gracias por elegirnos!" />
			<MensajeFinalPDF contenido="Copyright &copy; Syndeo 2021" />
		</Page>
	</Document>
);

export default MainPDF;
