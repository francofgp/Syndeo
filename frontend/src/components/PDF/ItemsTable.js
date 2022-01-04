import React from "react";
import { View, StyleSheet } from "@react-pdf/renderer";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import TableBlankSpace from "./TableBlankSpace";
import TableFooter from "./TableFooter";

const tableRowsCount = 11;

const styles = StyleSheet.create({
	tableContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginTop: 24,
		borderWidth: 1,
		borderColor: "#bff0fd",
	},
});

const ItemsTable = ({ datosTabla, filasData }) => (
	<View style={styles.tableContainer}>
		<TableHeader />
		<TableRow filasData={filasData} />
		{/* <TableBlankSpace
			rowsCount={tableRowsCount - invoice.items.length}
		/> */}
		{/* <TableFooter items={invoice.items} /> */}
	</View>
);

export default ItemsTable;
