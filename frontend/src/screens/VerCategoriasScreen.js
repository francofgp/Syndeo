import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Button, ButtonGroup, Form } from "react-bootstrap";
import { getCategorias, deleteCategoria, updateCategoria } from "../redux/actions/categoriasActions";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter, customFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { selectFilter } from "react-bootstrap-table2-filter";
import cellEditFactory from "react-bootstrap-table2-editor";
import { LinkContainer } from "react-router-bootstrap";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import MetaDiaria from "../components/MetaDiaria";
import { isMobileOnly } from "react-device-detect";
import Tour from "reactour";

function VerCategoriasScreen({ history }) {
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const categorias = useSelector((state) => state.categorias);
	const { categoriasTotal, loading: loadingCategoriasDetails } = categorias;

	const categoriasDelete = useSelector((state) => state.categoriasDelete);
	const { success } = categoriasDelete;

	const [categoriaEliminar, setCategoriaEliminar] = useState("");
	const [tour, setTour] = useState(false);

	const dispatch = useDispatch();

	useEffect(() => {
		if (!userInfo) {
			history.push("/login?redirect=/verCategorias");
		} else {
			dispatch(getCategorias());
		}
	}, [dispatch, history, success, userInfo]);

	const handlerEliminar = () => {
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: "btn btn-danger",
				cancelButton: "btn btn-primary",
			},
			buttonsStyling: false,
		});
		swalWithBootstrapButtons
			.fire({
				title: "¿Está seguro que desea eliminar este elemento?",
				text: "Esta acción es irreversible.",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonText: "Cancelar",
				cancelButtonColor: "#d33",
				confirmButtonText: "Sí!",
			})
			.then((result) => {
				if (result.value) {
					dispatch(deleteCategoria(categoriaEliminar));
					swalWithBootstrapButtons.fire(
						"Eliminado!",
						"El elemento ha sido eliminado correctamente.",
						"success"
					);
				}
			});
	};

	const handlerEditar = (e) => {
		dispatch(updateCategoria(e));
	};

	///------------------------------------
	// bootstrap table 2

	if (isMobileOnly) {
		require("../styles/custom.css");
	}

	var noEditable = "";

	if (categoriasTotal !== undefined) {
		if (categoriasTotal.length > 0) {
			for (var i = 0; i < categoriasTotal.length; i++) {
				if (categoriasTotal[i].nombre === "Base") {
					noEditable = categoriasTotal[i].id;
				}
			}
		}
	}

	const selectRow = {
		mode: "radio",
		clickToSelect: true,
		onSelect: (row, isSelect, rowIndex, e) => {
			setCategoriaEliminar(row.id);
		},
		clickToEdit: true,
		nonSelectable: [noEditable],
	};

	const defaultSorted = [
		{
			dataField: "nombre",
			order: "asc",
		},
	];

	const rowStyle = {
		textAlign: "center",
		padding: "0px",
		height: "103px",
		width: "212px",
		fontSize: "1rem",
	};

	const customTotal = (from, to, size) => (
		<span className="react-bootstrap-table-pagination-total">
			Mostrando {from} a {to} de {size} resultados
		</span>
	);

	const options = {
		paginationSize: 4,
		pageStartIndex: 1,
		showTotal: true,
		disablePageTitle: true,
		sizePerPageList: [
			{
				text: "5",
				value: 5,
			},
			{
				text: "10",
				value: 10,
			},
			{
				text: "25",
				value: 25,
			},
			{
				text: "50",
				value: 50,
			},
			{
				text: "All",
				value: categoriasTotal.length,
			},
		],
		paginationTotalRenderer: customTotal,
	};

	const headerStyle = () => {
		return {
			textAlign: "center",
			fontSize: isMobileOnly ? "5vw" : "1.5em",
		};
	};

	var onNombreFilter = null;

	const onNombreChange = (event) => {
		const { value } = event.target;
		onNombreFilter(value);
	};

	const columns = [
		/*{	dataField: "id", text: "ID",}, Categorías*/
		{
			dataField: "nombre",
			text: isMobileOnly ? <i className="fas fa-font"></i> : "Nombre",
			//filter: textFilter({ placeholder: "Buscar por nombre" }),
			filter: customFilter(),
			filterRenderer: (onFilter, column) => {
				onNombreFilter = onFilter;
				return null;
			},
			headerStyle,
			headerAttrs: {
				"data-tut": "header-nombre",
			},
			attrs: {
				"data-tut": "categoria",
			},
			footer: `Los textos que pertenezcan a una categoría eliminada, serán asignados a la categoría 'Base' automáticamente.`,
			footerStyle: { fontSize: "10px" },
			footerAlign: "left",

			sort: true,
			editable: (content, row, rowIndex, columnIndex) => row.id !== noEditable,
		},
		{
			dataField: "descripcion",
			text: isMobileOnly ? <i className="fas fa-align-left"></i> : "Descripción",
			headerAttrs: {
				"data-tut": "header-descripcion",
			},
			attrs: {
				"data-tut": "descripcion",
			},
			sort: true,
			footer: "",

			headerStyle,
			filter: textFilter({ placeholder: "Buscar por descripción" }),
			editable: (content, row, rowIndex, columnIndex) => row.id !== noEditable,
		},
	];

	///------------------------------------

	const tourConfig = [
		{
			selector: '[data-tut="titulo"]',
			content: () => (
				<div className="text-justify">
					<h3 className="text-center">¿Necesitas ayuda?</h3>
					En esta sección podrás crear categorías para asignarlas a tus textos y así poder organizarlos.
				</div>
			),
		},
		{
			selector: '[data-tut="tabla"]',
			content: () => (
				<div className="text-justify">
					<h3 className="text-center">Categorías:</h3>
					Tus categorías se mostrarán aquí.
				</div>
			),
			stepInteraction: false,
		},
		{
			selector: '[data-tut="nueva"]',
			content: () => (
				<div className="text-justify">
					<h3 className="text-center">
						<i className="fas fa-plus"></i> categoría:
					</h3>
					Presione aquí si desea crear una nueva categoría.
				</div>
			),
			stepInteraction: false,
		},
		{
			selector: '[data-tut="categoria"]',
			content: () => (
				<div className="text-justify">
					<h4 className="text-center">Selección:</h4>
					Puedes presionar sobre cualquier categoría para seleccionarla.
					<p style={{ fontWeight: "900" }}>
						Excepto la categoría <span style={{ color: "tomato" }}>"Base"</span>.
					</p>
				</div>
			),
		},
		{
			selector: '[data-tut="eliminar"]',
			content: () => (
				<div className="text-justify">
					<h4 className="text-center">
						Eliminar <i className="fas fa-trash"></i>:
					</h4>
					Para eliminar la categoría seleccionada, solo presione <i className="fas fa-trash"></i>.
				</div>
			),
			stepInteraction: false,
		},

		{
			selector: '[data-tut="header-nombre"]',
			content: () => (
				<div className="text-justify">
					<h3 className="text-center">
						Ordenar <i className="fas fa-sort">:</i>
					</h3>{" "}
					Puedes presionar cualquier encabezado, como estos, para ordenar los elementos de{" "}
					<h3 style={{ display: "inline-block" }}>
						<i className="fas fa-sort-up"></i>{" "}
					</h3>{" "}
					hacia
					<h3 style={{ display: "inline-block" }}>
						<i className="fas fa-sort-down"></i>
					</h3>
					<p style={{ fontWeight: "900" }}>¡Adelante, inténtalo!</p>
				</div>
			),
			highlightedSelectors: ['[data-tut="header-nombre"]', '[data-tut="header-descripcion"]'],
			//position: [160, 250],
			//action: () => animateScroll.scrollToTop({}),
		},
		{
			selector: '[data-tut="descripcion"]',
			content: () => (
				<div className="text-justify">
					<h3 className="text-center">
						Modificar <i className="fas fa-edit">:</i>
					</h3>
					Al terminar el tour, podrás presionar aquí nuevamente y cambiar la descripción. Podrás hacer lo
					mismo con el nombre, si así lo deseas.
				</div>
			),
			stepInteraction: false /* Lo desactivo, debido a que se presenta un comportamiento raro, al interactuar con la tabla
			en este paso, y da un error en consola, es mejor asi */,
		},
		{
			selector: '[data-tut="filtro"]',
			content: () => (
				<div className="text-justify">
					Casi se nos olvida, aquí podras <i className="fas fa-search"></i> tus categorías.
				</div>
			),
			stepInteraction: false,
		},
		{
			selector: '[data-tut="mensaje-final"]',
			content: () => (
				<div className="text-justify">
					<h4 className="text-center">
						Ver de Nuevo <i className="fas fa-redo">:</i>
					</h4>
					Siempre puedes ver este mensaje cuantas veces quieras, ahora anímate a probarlo por tí mismo 😉.
				</div>
			),
			stepInteraction: false /* Lo desactivo, debido a que se presenta un comportamiento raro, al interactuar con la tabla
			en este paso, y da un error en consola, es mejor asi */,
		},
	];
	return (
		<div>
			{userInfo ? (
				<div>
					<MetaDiaria />
					<Row className="align-items-center">
						<Col>
							<h1 data-tut="titulo">Categorías</h1>
						</Col>

						<Col className="text-right">
							<Button
								data-tut="mensaje-final"
								className="my-3"
								variant="secondary"
								onClick={() => setTour(true)}
							>
								Ayuda <i className="far fa-question-circle"></i>
							</Button>{" "}
							<Button
								data-tut="eliminar"
								className="my-3"
								onClick={handlerEliminar}
								disabled={categoriaEliminar === ""}
							>
								<i className="fas fa-trash"></i>{" "}
							</Button>{" "}
							<LinkContainer to={`/registrarCategoria`}>
								<Button data-tut="nueva" className="my-3">
									<i className="fas fa-plus"></i>
								</Button>
							</LinkContainer>
						</Col>
					</Row>
					<Row>
						<Col xs={12} ms={12} md={12} lg={12} data-tut="filtro">
							<Form.Group controlId="idioma">
								<input className="form-control" onChange={onNombreChange} placeholder="Buscar" />
							</Form.Group>
						</Col>
					</Row>

					{loadingCategoriasDetails ? (
						<Loader />
					) : (
						<div data-tut="tabla">
							<BootstrapTable
								wrapperClasses="table-responsive tabla-sin-bordes-en-el-footer"
								//tabla-sin-bordes-en-el-footer VER CSS index.css
								keyField="id"
								data={categoriasTotal}
								columns={columns}
								filter={filterFactory()}
								filterPosition="top"
								selectRow={selectRow}
								rowStyle={rowStyle}
								defaultSorted={defaultSorted}
								pagination={paginationFactory(options)}
								cellEdit={cellEditFactory({
									mode: "click",
									afterSaveCell: (oldValue, newValue, row, column) => {
										handlerEditar(row);
									},
								})}
							/>
						</div>
					)}

					<Tour
						onRequestClose={() => setTour(false)}
						steps={tourConfig}
						isOpen={tour}
						rounded={5}
						accentColor="#5cb7b7"
					/>
				</div>
			) : null}
		</div>
	);
}

export default VerCategoriasScreen;
