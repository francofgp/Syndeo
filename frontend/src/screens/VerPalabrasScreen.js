import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button, Form, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import { getIdiomasUser } from "../redux/actions/IdiomasActions";
import { getPalabras, updatePalabra, traduccionPalabra } from "../redux/actions/palabrasActions";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter, customFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { selectFilter } from "react-bootstrap-table2-filter";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import Loader from "../components/Loader";
import Message from "../components/Message";
import MetaDiaria from "../components/MetaDiaria";
import { isMobileOnly, isTablet } from "react-device-detect";
import Tour from "reactour";
import imagenTraduccion from "../data/imagenesEstudiar/translate.png";

function VerPalabrasScreen({ history }) {
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const idiomasUser = useSelector((state) => state.idiomasUser);
	const { idiomasUserTotal } = idiomasUser;

	const palabrasDetails = useSelector((state) => state.palabrasDetails);
	const { palabras: palabrasRedux, success: successPalabras, loading: loadingPalabrasDetails } = palabrasDetails;

	const palabraTraducion = useSelector((state) => state.palabraTraduccion);
	const { traduccion, success: successTraduccion } = palabraTraducion;

	const palabraUpdate = useSelector((state) => state.palabraUpdate);
	const { success: successUpdate } = palabraUpdate;

	const [palabras, setPalabras] = useState([]);
	const [palabraSeleccionada, setPalabraSeleccionada] = useState("");
	const [tour, setTour] = useState(false);

	const [palabraTraducidaSeleccionada, setPalabraTraducidaSeleccionada] = useState("");
	const [cargarPalabras, setCargarPalabras] = useState(true);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!userInfo) {
			history.push("/login?redirect=/verPalabras");
		} else {
			dispatch(getIdiomasUser());
			dispatch(getPalabras());
		}
	}, [dispatch, history, userInfo]);

	useEffect(() => {
		if (successTraduccion) {
			setPalabraTraducidaSeleccionada(traduccion.translations[0].translation);
		}
	}, [successTraduccion, traduccion]);

	useEffect(() => {
		if (successUpdate) {
			dispatch(getPalabras());
		}
	}, [dispatch, successUpdate]);

	useEffect(() => {
		if (successPalabras) {
			setPalabras(palabrasRedux);
		}
	}, [successPalabras]);

	//------------------------------------------------------------------------

	function guardarTraduccionHandler() {
		palabraSeleccionada["traduccion"] = palabraTraducidaSeleccionada;
		dispatch(updatePalabra(palabraSeleccionada));
		setCargarPalabras(false);
	}

	function updatePalabraHandler(e) {
		palabraSeleccionada["dificultad"] = parseInt(e.dificultad);
		dispatch(updatePalabra(e));
		setCargarPalabras(false);
	}

	function traslationHandler() {
		dispatch(traduccionPalabra(palabraSeleccionada.idioma_objeto.name, palabraSeleccionada.palabra));
	}

	//---------------------------------
	// BOOTSTRAP_TABLE 2

	const selectOptionsDificultad = {
		//0: "No aprendida",
		1: "Fácil",
		2: "Media",
		3: "Difícil",
		4: "Aprendida",
		5: "Ignorada",
	};
	const selectOptionsDificultadNuevo = [
		//0: "No aprendida",
		{ dificultad: "Todas", id: "" },
		{ dificultad: "Fácil", id: 1 },
		{ dificultad: "Media", id: 2 },
		{ dificultad: "Difícil", id: 3 },
		{ dificultad: "Aprendida", id: 4 },
		{ dificultad: "Ignorada", id: 5 },
	];

	if (idiomasUserTotal !== undefined) {
		var opcionIdiomas = {};
		for (var i = 0; i < idiomasUserTotal.length; i++) {
			opcionIdiomas[idiomasUserTotal[i].id] = idiomasUserTotal[i].name;
		}
	}

	const rowStyle = {
		padding: "0px",
		height: ".3vh",
		width: ".5vw",
		fontSize: isMobileOnly ? "14px" : "16px",
		textAlign: "center",
	};

	const headerStyle = () => {
		return {
			fontSize: isMobileOnly ? "2.4vh" : "1.8vw",
			textAlign: "center",
		};
	};
	const selectoresStyle = {
		textAlign: "center",
		fontSize: "1rem",
		paddingLeft: "0px",
		paddingRight: "0px",
		marginLeft: "0px",
		marginRight: "0px",
		width: "13vw",
	};

	const selectoresStyleIdiomaDificultad = {
		textAlign: "center",
		fontSize: "1rem",
		paddingLeft: "0px",
		paddingRight: "0px",
		marginLeft: "0px",
		marginRight: "0px",
		width: "14vw	",
	};

	/*Estilo de lo de adentro de las columnas*/

	const style = () => {
		return {
			textAlign: "center",
			paddingTop: "1.7vw",
			paddingRight: "0px",
			paddingLeft: "0px",
			paddingBottom: "0px",
			marginTop: "0px",
			margingRight: "0px",
			margingLeft: "0px",
			margingBottom: "0px" /**/,
		};
	};

	const styleSelect = () => {
		return { textAlign: "right", paddingLeft: "0px" };
	};

	const palabraFormatter = (cell, row) => {
		if (row.dificultad === 0) {
			return (
				<span>
					<strong style={{ color: "blue" }}>{row.palabra}</strong>
				</span>
			);
		} else if (row.dificultad === 1) {
			return (
				<span>
					<strong style={{ color: "green" }}>{row.palabra}</strong>
				</span>
			);
		} else if (row.dificultad === 2) {
			return (
				<span>
					<strong style={{ color: "orange" }}>{row.palabra}</strong>
				</span>
			);
		} else if (row.dificultad === 3) {
			return (
				<span>
					<strong style={{ color: "red" }}>{row.palabra}</strong>
				</span>
			);
		} else if (row.dificultad === 4) {
			return (
				<span>
					<strong style={{ color: "black" }}>{row.palabra}</strong>
				</span>
			);
		} else if (row.dificultad === 5) {
			return (
				<span>
					<strong style={{ color: "black" }}>{row.palabra}</strong>
				</span>
			);
		}
	};
	var onPriceFilter = null;
	var onIdiomaFilter = null;
	var onDificultadFilter = null;

	const onPriceChange = (event) => {
		const { value } = event.target;
		onPriceFilter(value);
	};

	const onIdiomaChange = (event) => {
		const { value } = event.target;
		onIdiomaFilter(value);
	};

	const onDificultadChange = (event) => {
		const { value } = event.target;
		onDificultadFilter(value);
	};

	const columns = [
		/*	{ dataField: "id", text: "ID", headerStyle, style, },*/
		{
			dataField: "palabra",
			text: isMobileOnly ? <i className="fas fa-font"></i> : "Palabra",
			headerStyle,
			headerAttrs: {
				"data-tut": "header-palabra",
			},
			attrs: {
				"data-tut": "palabra",
			},

			style,
			/* filter: textFilter({
				placeholder: "Buscar",
				style: selectoresStyle,
			}), */
			filter: customFilter(),
			filterRenderer: (onFilter, column) => {
				onPriceFilter = onFilter;
				return null;
			},
			sort: true,
			formatter: palabraFormatter,
			editable: false,
		},
		{
			dataField: "idioma_objeto.id",
			text: isMobileOnly ? <i className="fas fa-globe-americas"></i> : "Idioma ",
			headerAttrs: {
				"data-tut": "header-idioma",
			},
			headerStyle,
			style,

			/* filter: selectFilter({
				style: selectoresStyleIdiomaDificultad,
				options: opcionIdiomas,
				placeholder: "Idioma",
			}), */
			filter: customFilter(),
			filterRenderer: (onFilter, column) => {
				onIdiomaFilter = onFilter;
				return null;
			},
			sort: true,
			editable: false,
			formatter: (cell, row) => {
				if (row.idioma !== null) {
					return row.idioma_objeto.name;
				} else {
					return "-";
				}
			},
		},
		{
			dataField: "dificultad",
			text: isMobileOnly ? <i className="fas fa-tachometer-alt"></i> : "Dificultad ",
			headerStyle,
			style,
			headerAttrs: {
				"data-tut": "header-dificultad",
			},
			attrs: {
				"data-tut": "dificultad",
			},
			formatter: (cell) => selectOptionsDificultad[cell],
			/* filter: selectFilter({
				style: selectoresStyleIdiomaDificultad,
				options: selectOptionsDificultad,
				placeholder: "Dificultad",
			}), */
			filter: customFilter(),
			filterRenderer: (onFilter, column) => {
				onDificultadFilter = onFilter;
				return null;
			},
			sort: true,
			editor: {
				type: Type.SELECT,
				options: [
					{
						value: 0,
						label: "No aprendida",
					},
					{
						value: 1,
						label: "Fácil",
					},
					{
						value: 2,
						label: "Media",
					},
					{
						value: 3,
						label: "Difícil",
					},
					{
						value: 4,
						label: "Aprendida",
					},
					{
						value: 5,
						label: "Ignorada",
					},
				],
			},
		},
		{
			dataField: "traduccion",
			text: isMobileOnly ? <i className="fas fa-language"></i> : "Traducción",
			headerStyle,
			headerAttrs: {
				"data-tut": "header-traduccion",
			},
			attrs: {
				"data-tut": "traduccion",
			},

			style,
			formatter: (cell, row) => {
				if (row.traduccion !== null) {
					return row.traduccion;
				} else {
					return "-";
				}
			},
		},
	];

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
				value: palabras.length,
			},
		],
		paginationTotalRenderer: customTotal,
	};

	const selectRow = {
		mode: "radio",
		clickToSelect: true,
		onSelect: (row, isSelect, rowIndex, e) => {
			setPalabraSeleccionada(row);
			if (row.traduccion !== null) {
				setPalabraTraducidaSeleccionada(row.traduccion);
			} else {
				setPalabraTraducidaSeleccionada("");
			}
		},
		clickToEdit: true,
	};

	const defaultSorted = [{ dataField: "palabra", order: "asc" }];

	const data = {
		id: "5df3180a09ea16dc4b95f910",
		items: [
			{
				sr: 1,
				desc: "desc1",
				xyz: 5,
			},
			{
				sr: 2,
				desc: "desc2",
				xyz: 6,
			},
		],
	};

	const containsObject = (obj, list) => {
		var i;
		for (i = 0; i < list.length; i++) {
			if (list[i] === obj) {
				return true;
			}
		}

		return false;
	};

	const getIdiomasMasTodos = () => {
		if (idiomasUserTotal) {
			const array = [{ id: "", name: "Todos" }];
			const mergeResult = [...array, ...idiomasUserTotal];
			return mergeResult;
		}
		return [{ id: "", name: "Todos" }];
	};

	const tourConfig = [
		{
			selector: '[data-tut="titulo"]',
			content: () => (
				<div className="text-justify">
					<h3 className="text-center">¿Necesitas ayuda?</h3>
					En esta sección encontrarás todas las palabras que tengas en tus textos.
				</div>
			),
		},

		{
			selector: '[data-tut="tabla"]',
			content: () => (
				<div className="text-justify">
					<h3 className="text-center">Vocabulario:</h3>
					Tus palabras se mostrarán aquí.
				</div>
			),
			stepInteraction: false,
		},
		{
			selector: '[data-tut="palabra"]',
			content: () => (
				<div className="text-justify">
					<h4 className="text-center">Selección:</h4>
					Presione sobre cualquier palabra para seleccionarla.
					<p style={{ fontWeight: "900" }}>¡Adelante, presione esta palabra!</p>
				</div>
			),
		},
		{
			selector: '[data-tut="seleccion-traduccion"]',
			content: () => (
				<div className="text-justify">
					Aquí podrás ver la palabra que seleccionaste y la traducción que le asignaste, claro, si es que lo
					hiciste.
				</div>
			),
			stepInteraction: false,
		},
		{
			selector: '[data-tut="traducir"]',
			content: () => (
				<div className="text-justify">
					<h3 className="text-center">Traducir:</h3> Siempre puedes presionar aquí para traducir una palabra.
					<p style={{ fontWeight: "900" }}>¡Adelante, hazlo!</p>
				</div>
			),
		},
		{
			selector: '[data-tut="guardar-traduccion"]',
			content: () => (
				<div className="text-justify">
					<h3 className="text-center">
						Guardar <i className="fas fa-save">:</i>
					</h3>{" "}
					Cuando hayas obtenido la traducción, puedes guardarla o modificarla a tu gusto.
				</div>
			),
		},
		{
			selector: '[data-tut="filtros"]',
			content: () => (
				<div className="text-justify">
					<h3 className="text-center">
						Búsqueda <i className="fas fa-search">:</i>
					</h3>
					Aquí podrás buscar las palabras usando diferentes filtros.
				</div>
			),
		},
		{
			selector: '[data-tut="header-palabra"]',
			content: () => (
				<div className="text-justify">
					<h3 className="text-center">
						Ordenar <i className="fas fa-sort">:</i>
					</h3>{" "}
					Puedes presionar cualquier encabezado, como este, para ordenar los elementos de{" "}
					<h3 style={{ display: "inline-block" }}>
						<i className="fas fa-sort-up"></i>{" "}
					</h3>{" "}
					hacia{" "}
					<h3 style={{ display: "inline-block" }}>
						<i className="fas fa-sort-down"></i>
					</h3>
					.<p style={{ fontWeight: "900" }}>¡Adelante, inténtalo!</p>
				</div>
			),
			highlightedSelectors: [
				'[data-tut="header-traduccion"]',
				'[data-tut="header-palabra"]',
				'[data-tut="header-idioma"]',
				'[data-tut="header-dificultad"]',
			],
			//position: [160, 250],
			//action: () => animateScroll.scrollToTop({}),
		},
		{
			selector: '[data-tut="dificultad"]',
			content: () => (
				<div className="text-justify">
					<h3 className="text-center">
						Modificar <i className="fas fa-tachometer-alt">:</i>
					</h3>
					Al terminar el tour, podrás venir aquí nuevamente y cambiar la dificultad de las palabras.
				</div>
			),
			stepInteraction: false /* Lo desactivo, debido a que se presenta un comportamiento raro, al interactuar con la tabla
			en este paso, y da un error en consola, es mejor asi */,
		},

		{
			selector: '[data-tut="traduccion"]',
			content: () => (
				<div className="text-justify">
					<h3 className="text-center">
						Modificar <i className="fas fa-language">:</i>
					</h3>
					Lo mismo podrás hacer con las traducciones.
				</div>
			),
			stepInteraction: false /* Lo desactivo, debido a que se presenta un comportamiento raro, al interactuar con la tabla
			en este paso, y da un error en consola, es mejor asi */,
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

	/* Para agregar el atributo "header-tabla" y asi tener para el recorrido */
	/* document.getElementsByClassName("header-tabla").length > 0 &&
		document
			.getElementsByClassName("header-tabla")[0]
			.setAttribute("data-tut", "header"); */

	return (
		<div>
			{userInfo && (
				<div>
					<MetaDiaria />
					<Row className="align-items-center">
						<Col>
							<h1 data-tut="titulo">Vocabulario</h1>
						</Col>
						<Button
							data-tut="mensaje-final"
							className="float-right"
							bsstyle="danger"
							bssize="small"
							variant="secondary"
							onClick={() => setTour(true)}
						>
							Ayuda <i className="far fa-question-circle"></i>
						</Button>
					</Row>

					{loadingPalabrasDetails && cargarPalabras ? (
						<Loader />
					) : palabrasRedux.length === 0 && successPalabras ? (
						<Message variant="danger"> No hay palabras en su vocabulario</Message>
					) : (
						userInfo && (
							<div>
								<Row data-tut="filtros">
									<Col xs={12} ms={12} md={12} lg={8}>
										<Form.Group controlId="idioma">
											<Form.Label>Palabra</Form.Label>
											<input
												className="form-control"
												onChange={onPriceChange}
												placeholder="Buscar"
											/>
										</Form.Group>
									</Col>
									<Col>
										<Form.Group controlId="idioma">
											<Form.Label>Idioma</Form.Label>
											{idiomasUserTotal !== "" && (
												<div>
													<select
														id="pais"
														className="form-control"
														defaultValue={""}
														onChange={onIdiomaChange}
													>
														{idiomasUserTotal &&
															getIdiomasMasTodos().map((obj) => {
																return (
																	<option key={obj.id} value={obj.id}>
																		{obj.name}
																	</option>
																);
															})}
													</select>
												</div>
											)}
										</Form.Group>
									</Col>

									<Col>
										<Form.Group controlId="idioma">
											<Form.Label>Dificultad</Form.Label>
											{idiomasUserTotal !== "" && (
												<div>
													<select
														id="pais"
														className="form-control"
														defaultValue={""}
														onChange={onDificultadChange}
													>
														{idiomasUserTotal &&
															selectOptionsDificultadNuevo.map((obj) => {
																return (
																	<option key={obj.id} value={obj.id}>
																		{obj.dificultad}
																	</option>
																);
															})}
													</select>
												</div>
											)}
										</Form.Group>
									</Col>
								</Row>
								<div data-tut="tabla">
									<BootstrapTable
										wrapperClasses="table-responsive"
										headerWrapperClasses="header-tabla"
										className="table table-bordered"
										keyField="id"
										data={palabras}
										columns={columns}
										cellEdit={cellEditFactory({
											mode: "click",
											afterSaveCell: (oldValue, newValue, row, column) => {
												updatePalabraHandler(row);
											},
											blurToSave: true,
										})}
										pagination={paginationFactory(options)}
										filter={filterFactory()}
										selectRow={selectRow}
										filterPosition="top"
										rowStyle={rowStyle}
										defaultSorted={defaultSorted}
									/>
								</div>
								<br />
								<div data-tut="seleccion-traduccion">
									<h4 style={{ display: "inline-block" }} className="mt-4">
										Seleccionaste:{" "}
									</h4>
									<h5 style={{ display: "inline-block" }}>
										{`${palabraSeleccionada.palabra ? palabraSeleccionada.palabra : ""}`}{" "}
										{/* 2800 es un caracter invisible */}
									</h5>
									<br></br>
									<span>
										{palabraSeleccionada
											? `Traducción de ${palabraSeleccionada.idioma_objeto.name} a ${userInfo.idioma}`
											: ""}{" "}
									</span>

									<Form>
										<Form.Group controlId="name">
											<Form.Control
												size="lg"
												type="text"
												style={{ height: "50px" }}
												placeholder=""
												value={palabraTraducidaSeleccionada}
												onChange={(e) => {
													setPalabraTraducidaSeleccionada(e.target.value);
												}}
											></Form.Control>
										</Form.Group>
									</Form>
									<ButtonToolbar>
										<ButtonGroup className="me-2" aria-label="Second group">
											<Button
												data-tut="traducir"
												variant="primary mr-1"
												onClick={traslationHandler}
												disabled={palabraSeleccionada.palabra == null}
											>
												<img
													alt="description"
													src={imagenTraduccion}
													style={{
														width: 16,
														height: 16,
													}}
												/>{" "}
												Traducir
											</Button>
											<p> </p>
											<Button
												data-tut="guardar-traduccion"
												variant="primary"
												onClick={guardarTraduccionHandler}
												disabled={
													palabraTraducidaSeleccionada === "" ||
													palabraSeleccionada.palabra == null
												}
											>
												<i style={{ fontSize: "16px" }} className="fas fa-save"></i>
												{/* hay un caracter invisible a la izquierda de guardar */}
												ㅤGuardar
											</Button>
										</ButtonGroup>
									</ButtonToolbar>
								</div>
								<Tour
									onRequestClose={() => setTour(false)}
									steps={tourConfig}
									isOpen={tour}
									rounded={5}
									accentColor="#5cb7b7"
								/>
							</div>
						)
					)}
				</div>
			)}
		</div>
	);
}

export default VerPalabrasScreen;
