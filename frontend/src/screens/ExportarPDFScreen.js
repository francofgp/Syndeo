import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIdiomasUser } from "../redux/actions/IdiomasActions";
import { Container, Image, Row, Col, Button, Form } from "react-bootstrap";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MainPDF from "../components/PDF/MainPDF";
//import axios from "axios";
import { getPalabrasPDF } from "../redux/actions/palabrasActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import imagenPDF from "../data/PDF/PDF_file_icon.svg";
import { PALABRAS_DETAILS_RESET } from "../redux/constants/palabrasConstants";
import MetaDiaria from "../components/MetaDiaria";
import { isMobile } from "react-device-detect";

function ExportarPDFScreen({ history }) {
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const idiomasUser = useSelector((state) => state.idiomasUser);
	const { idiomasUserTotal, success: successIdiomasUser } = idiomasUser;

	const palabrasDetails = useSelector((state) => state.palabrasDetails);
	const { palabras, loading, success } = palabrasDetails;

	const [idiomaRepasar, setIdiomaRepasar] = useState("");
	const [dificultad, setDificultad] = useState("5");
	const [nombreIdioma, setNombreIdioma] = useState("");
	const [primeraVezClickGenerar, setPrimeraVezClickGenerar] = useState(false);

	const dispatch = useDispatch();

	useEffect(() => {
		if (!userInfo) {
			history.push("/login?redirect=/configuracionExportar");
		} else {
			dispatch({ type: PALABRAS_DETAILS_RESET });
			if (!successIdiomasUser) {
				dispatch(getIdiomasUser());
			} else if (successIdiomasUser) {
				if (idiomasUserTotal.length > 0) {
					setIdiomaRepasar(idiomasUserTotal[0].id);
					setNombreIdioma(idiomasUserTotal[0].name);
				}
			}
		}
	}, [dispatch, history, userInfo, successIdiomasUser]);

	const datosTabla = {
		id: "5df3180a09ea16dc4b95f910",
		idioma: nombreIdioma,
		nombre: userInfo ? userInfo.name : null,
		email: userInfo ? userInfo.email : null,
		cantidadDePalabras: palabras.length,
	};

	const generarPDF = () => {
		setPrimeraVezClickGenerar(true);
		dispatch(getPalabrasPDF(idiomaRepasar, dificultad));
	};

	var explicacionVocabulario = (
		<div>
			<h4>¿Quiéres llevar tu vocabulario contigo?</h4>
			<br></br>
			Syndeo te brinda la posibilidad de exportar tus palabras a PDF para
			que las puedas llevar a donde quieras y continuar estudiando.
		</div>
	);

	return (
		<div>
			{userInfo ? (
				<div>
					<br />
					<MetaDiaria />
					<Container fluid="md">
						<Row>
							<Col xs={4} md={4}>
								<Image
									src={imagenPDF} //"https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
									rounded
									style={{
										height: "70%",
										margin: "auto",
										display: "block",
									}}
									width={isMobile ? "100%" : "70%"}
								/>
							</Col>
							<Col xs={5} md={8} className="text-justify">
								{isMobile ? (
									<h3>¡Exportá tu vocabulario a PDF!</h3>
								) : (
									<h2>¡Exportá tu vocabulario a PDF!</h2>
								)}
								<br></br>
								{!isMobile ? explicacionVocabulario : null}
							</Col>
							{isMobile ? explicacionVocabulario : null}
						</Row>
					</Container>

					<p />
					<p />

					{idiomasUserTotal.length === 0 && successIdiomasUser ? (
						<Message variant="danger">
							{" "}
							No hay textos registrados
						</Message>
					) : successIdiomasUser ? (
						<div>
							<Row className="align-items-center">
								<Col>
									<p>
										Seleccione el idioma y la dificultad de
										las palabras:
									</p>
								</Col>
							</Row>

							<Form>
								<Form.Group controlId="idioma">
									<Form.Label>Idioma:</Form.Label>
									{idiomasUserTotal !== "" && (
										<div>
											<select
												id="pais"
												className="form-control"
												defaultValue={idiomaRepasar}
												onChange={(e) => {
													setIdiomaRepasar(
														e.target.value.split(
															","
														)[0]
													);
													setNombreIdioma(
														e.target.value.split(
															","
														)[1]
													);
												}}
											>
												{idiomasUserTotal.map((obj) => {
													return (
														<option
															key={obj.name}
															value={[
																obj.id,
																obj.name,
															]}
														>
															{obj.name}
														</option>
													);
												})}
											</select>
										</div>
									)}
								</Form.Group>

								<Form.Group controlId="idioma">
									<Form.Label>Dificultad:</Form.Label>
									<div>
										<select
											className="form-control"
											onChange={(e) =>
												setDificultad(e.target.value)
											}
										>
											<option value="5">Todas</option>
											<option value="1">Fáciles</option>
											<option value="2">Medias</option>
											<option value="3">Difíciles</option>
											<option value="4">
												Aprendidas
											</option>
										</select>
									</div>
								</Form.Group>
							</Form>

							<Button
								className="my-3"
								style={{ height: "45px" }}
								onClick={generarPDF}
							>
								Generar PDF
							</Button>
							<br></br>
							{loading ? <Loader /> : null}
							{success &&
							palabras.length > 0 &&
							primeraVezClickGenerar ? (
								<Form>
									<PDFDownloadLink
										className="btn btn-success my-3"
										document={
											<MainPDF
												filasData={palabras}
												datosTabla={datosTabla}
											/>
										}
										fileName="Vocabulario.pdf"
										style={{ height: "45px" }}
									>
										{/* {({ blob, url, loading, error }) =>
						loading ? "Loading document..." : "Download now!"
					} */}
										Descargar
									</PDFDownloadLink>
									<Form.Text className="text-muted">
										Su PDF se encuentra listo para ser
										descargado.
									</Form.Text>
								</Form>
							) : null}
						</div>
					) : null}

					{success &&
					palabras.length === 0 &&
					primeraVezClickGenerar ? (
						<Message variant="danger">
							{" "}
							No hay palabras disponibles con los parámetros
							ingresados
						</Message>
					) : null}
					{/* 	<Fragment>
				<PDFViewer width="1000" height="1200" className="app">
					<MainPDF filasData={palabras} datosTabla={datosTabla} />
				</PDFViewer>
			</Fragment> */}
				</div>
			) : null}
		</div>
	);
}

export default ExportarPDFScreen;

/*
useEffect(() => {
	if (idiomasUserTotal !== undefined) {
		if (idiomasUserTotal.length > 0) {

		}
	}
}, [idiomasUserTotal]);
*/
