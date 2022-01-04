import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIdiomasUser } from "../redux/actions/IdiomasActions";
import { LinkContainer } from "react-router-bootstrap";
import { Container, Image, Row, Col, Button, Form } from "react-bootstrap";
import Loader from "../components/Loader";
import imagenFlashCards from "../data/imagenPreRepasar/flashcards.png";
import { PALABRAS_REPASAR_RESET } from "../redux/constants/palabrasConstants";
import Message from "../components/Message";
import MetaDiaria from "../components/MetaDiaria";
import { isMobile } from "react-device-detect";

function PreRepasarScreen({ history }) {
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const idiomasUser = useSelector((state) => state.idiomasUser);
	const { idiomasUserTotal, success, loading: loadingIdiomas } = idiomasUser;

	const [orden, setOrden] = useState("viejas");
	const [modo, setModo] = useState("nativo");
	const [idiomaRepasar, setIdiomaRepasar] = useState("");
	const [cantidadPalabras, setCantidadPalabras] = useState(5);

	const dispatch = useDispatch();

	useEffect(() => {
		if (!userInfo) {
			history.push("/login?redirect=/configuracionRepasar");
		} else {
			dispatch({ type: PALABRAS_REPASAR_RESET });
			if (!success) {
				dispatch(getIdiomasUser());
			} else if (success) {
				if (idiomasUserTotal.length > 0) {
					setIdiomaRepasar(idiomasUserTotal[0].id);
				}
			}
		}
	}, [dispatch, history, userInfo, success]);

	var flashCards = (
		<div>
			<h4>¿Qué son?</h4>
			<br></br>
			Una “flashcard” es una pequeña anotación, en papel o digital, en la
			que dejas anotado todas tus ideas relacionadas con un tema, donde de
			una cara tendremos lo que queremos recordar, y del otro la
			respuesta, en nuestra caso, las palabras que guardaste en tu
			vocabulario.
			<br></br>
			<br></br>
			Syndeo te ofrece la posibilidad de repasar automáticamente todas tus
			palabras que fuiste agregando a tu vocabulario de una manera rápida
			y sencilla.
			<br></br>
			<br></br>
			Tan solo elige el idioma y la cantidad de palabras a repasar y
			Syndeo hará el resto del trabajo por tí, ofreciéndote un mazo de
			flashcards.{" "}
		</div>
	);

	return (
		<div>
			{userInfo && (
				<div>
					<MetaDiaria />
					<br />
					<Container fluid="md">
						<Row>
							<Col xs={6} md={4}>
								<Image
									src={imagenFlashCards}
									rounded
									width={isMobile ? "100%" : "70%"}
								/>
							</Col>
							<Col xs={6} md={8} className="text-justify">
								<h2>¡Estudiá con Flashcards!</h2>
								<br></br>
								{!isMobile && flashCards}
							</Col>
							{isMobile && flashCards}
						</Row>
					</Container>

					<Row className="align-items-center">
						<Col>
							<h1>Repasar</h1>
							<p>Seleccione los siguientes parámetros:</p>
						</Col>
					</Row>

					<Form>
						{loadingIdiomas ? (
							<Loader />
						) : idiomasUserTotal.length === 0 &&
						  success &&
						  idiomasUserTotal ? (
							<Message variant="danger">
								{" "}
								No hay textos registrados
							</Message>
						) : (
							<div>
								<Form.Group controlId="idioma">
									<Form.Label>Idioma:</Form.Label>
									{idiomasUserTotal !== "" && (
										<div>
											<select
												id="pais"
												className="form-control"
												defaultValue={idiomaRepasar}
												onChange={(e) =>
													setIdiomaRepasar(
														e.target.value
													)
												}
											>
												{idiomasUserTotal.map((obj) => {
													return (
														<option
															key={obj.name}
															value={obj.id}
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
									<Form.Label>
										Cantidad de palabras:
									</Form.Label>
									<div>
										<select
											className="form-control"
											onChange={(e) =>
												setCantidadPalabras(
													e.target.value
												)
											}
										>
											<option value="5">5</option>
											<option value="10">10</option>
											<option value="20">20</option>
											<option value="30">30</option>
											<option value="40">40</option>
											<option value="50">50</option>
											<option value="100">100</option>
										</select>
									</div>
								</Form.Group>

								<Form.Label>Orden:</Form.Label>
								<Form.Control
									as="select"
									value={orden}
									onChange={(e) => {
										setOrden(e.target.value);
									}}
								>
									<option value="viejas">Más viejas</option>
									<option value="nuevas">Más Nuevas</option>
								</Form.Control>
								<p></p>

								<Form.Group controlId="idioma">
									<Form.Label>Modo:</Form.Label>
									<div>
										<select
											className="form-control"
											onChange={(e) =>
												setModo(e.target.value)
											}
										>
											<option value="nativo">
												Idioma Nativo - Idioma Objetivo
											</option>
											<option value="objetivo">
												Idioma Objetivo - Idioma Nativo
											</option>
										</select>
									</div>
								</Form.Group>
								<br></br>
								<LinkContainer
									to={`/repasar/${idiomaRepasar}/${cantidadPalabras}/${orden}/${modo}`}
								>
									<div className="btn-group">
										<Button variant="primary">
											Repasar
										</Button>
									</div>
								</LinkContainer>
							</div>
						)}
					</Form>
				</div>
			)}
		</div>
	);
}

export default PreRepasarScreen;
