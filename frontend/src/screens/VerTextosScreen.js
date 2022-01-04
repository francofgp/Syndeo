import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { LinkContainer } from "react-router-bootstrap";
import { Row, Col, Button, Alert, Form, Card, Container, ButtonGroup } from "react-bootstrap";
import { getIdiomas, getIdiomasUser } from "../redux/actions/IdiomasActions";
import { getCategorias } from "../redux/actions/categoriasActions";
import { getTextosDetails, getTextosQuery, deleteTexto } from "../redux/actions/textosActions";
import Loader from "../components/Loader";
//import { PALABRAS_DETAILS_RESET } from "../redux/constants/palabrasConstants"
import { IDIOMAS_USER_DETAILS_RESET } from "../redux/constants/idiomasConstants";
import { PALABRAS_DETAILS_RESET } from "../redux/constants/palabrasConstants";
import { getPalabras } from "../redux/actions/palabrasActions";
import MetaDiaria from "../components/MetaDiaria";
import InfiniteScroll from "react-infinite-scroll-component";

function VerTextosScreen({ history }) {
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const categorias = useSelector((state) => state.categorias);
	const { categoriasTotal } = categorias;

	const idiomas = useSelector((state) => state.idiomas);
	const { idiomasTotal } = idiomas;

	const textosDB = useSelector((state) => state.textosInfo);
	const { textos, loading } = textosDB;

	const textosDelete = useSelector((state) => state.textosDelete);
	const { success: successDelete } = textosDelete;

	const [busqueda, setBusqueda] = useState("");
	//const [showAlert, setShowAlert] = useState(false);
	const [paginado, setPaginado] = useState(12);

	const [hasMore, setHasMore] = useState(true);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!userInfo) {
			history.push("/login?redirect=/verTextos");
		} else {
			dispatch(getIdiomas());
			dispatch(getCategorias());
			dispatch(getTextosDetails(userInfo.id));
			//dispatch({ type: IDIOMAS_USER_DETAILS_RESET });
			//dispatch(getIdiomasUser());
		}
		if (successDelete) {
			dispatch(getPalabras());
			dispatch(getIdiomasUser());
		}
		/*
				setTimeout(() => {
					//Para que pase un tiempo para que muestre la alerta,
					/* porque sino, cuando le das enter, se puede ver el cartel de fondo, entre
					el tiempo que va a django y pide la query no hay nada y se ve el cartel un instante 
					//setShowAlert(true);
				}, 500);
		*/
	}, [dispatch, history, userInfo, successDelete]);

	const deleteHandler = (id) => {
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: "btn btn-success",
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
					dispatch(deleteTexto(id));
					//dispatch(getIdiomasUser())
					//dispatch({ type: PALABRAS_DETAILS_RESET });
					swalWithBootstrapButtons.fire(
						"Eliminado!",
						"El elemento ha sido eliminado correctamente.",
						"success"
					);
				}
			});
	};

	const busquedaConQuery = () => {
		if (busqueda !== "") {
			dispatch(getTextosQuery(busqueda));
		} else {
			dispatch(getTextosDetails(userInfo.id));
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			busquedaConQuery();
		}
	};

	const noHayTextos = () => {
		return (
			<Alert variant="info">
				<Alert.Heading>No se encontraron resultados ☹</Alert.Heading>
				<p>Por favor ingrese un nuevo término de búsqueda e inténtelo nuevamente, o cargue un nuevo texto.</p>
			</Alert>
		);
	};

	const limpiar = () => {
		setBusqueda("");
	};

	const listar = () => {
		setHasMore(true);
		setPaginado(12);
		dispatch(getTextosDetails(userInfo.id));
	};

	//----------------------------

	const controlPaginado = () => {
		if (paginado + 3 > textos.length) {
			setPaginado(textos.length);
			setHasMore(false);
		} else {
			setHasMore(true);
			setPaginado(paginado + 3);
		}
	};

	return (
		<div>
			{userInfo ? (
				<div>
					<MetaDiaria />
					<Row className="align-items-center">
						<Col>
							<h1>Textos</h1>
						</Col>

						<Col className="text-right">
							<LinkContainer to={`/registrarTexto`}>
								<Button /*className="my-3"*/>
									<i className="fas fa-plus"></i> REGISTRAR
								</Button>
							</LinkContainer>
						</Col>
					</Row>

					<div>
						<Row className="align-items-center">
							<Col md={9} xs={12}>
								<Form.Group controlId="busqueda">
									<Form.Label>Búsqueda</Form.Label>
									<Form.Control
										//style={{ width: "750px" }}
										//className="my-3"
										type="text"
										placeholder="Ingrese Título, Categoría o Idioma"
										value={busqueda}
										onChange={(e) => setBusqueda(e.target.value)}
										onKeyDown={handleKeyDown}
									></Form.Control>
								</Form.Group>
							</Col>
							<Col className="text-right" style={{ height: "65px" }} md={3} xs={3}>
								<ButtonGroup>
									<Button
										className="my-3 mr-2"
										style={{ height: "45px" }}
										onClick={limpiar}
										disabled={busqueda === ""}
									>
										<i className="fas fa-times"></i>
									</Button>

									<Button className="my-3 mr-2" style={{ height: "45px" }} onClick={busquedaConQuery}>
										<i className="fas fa-search"></i>
									</Button>

									<Button className="my-3" style={{ height: "45px" }} onClick={listar}>
										<i className="fas fa-redo"></i>
									</Button>
								</ButtonGroup>
							</Col>
						</Row>

						{loading ? (
							<Loader />
						) : (
							<div>
								{textos.length > 0 ? (
									<InfiniteScroll
										dataLength={paginado}
										next={controlPaginado}
										hasMore={hasMore}
										loader={<Loader />}
										style={{ overflow: "hidden" }}
									>
										<Row
											/* xs={1}
											ms={2}
											md={2}
											lg={3} */
											className="g-3"
										>
											{textos
												.slice(0, textos.length < 12 ? textos.length : paginado)
												.map((texto) => (
													<Col key={texto.id} xs={12} ms={12} md={6} lg={6} xl={4}>
														<Card
															className="mb-3 ml-2 mr-0"
															bg="light"
															border="dark"
															style={{
																width: "20rem",
																height: "30rem",
															}}
														>
															<Card.Header>
																{texto.completado ? "Leído" : "No Leído"}
															</Card.Header>

															<Card.Img
																variant="top"
																width="100"
																height="220"
																src={texto.imagen}
																style={{
																	padding: "2% 2% 0% 2%",
																}} /* arriba, derecha, abajo, izquierda */
															/>

															<Card.Body>
																<Card.Title>{texto.nombre}</Card.Title>
																<Card.Subtitle className="mb-2 text-muted">
																	{idiomasTotal.map((idioma) => {
																		if (texto.idioma === idioma.id) {
																			return idioma.name;
																		} else {
																			return null;
																		}
																	})}
																	{"-"}
																	{categoriasTotal.map((categoria) => {
																		if (texto.categoria === categoria.id) {
																			return categoria.nombre;
																		} else {
																			return null;
																		}
																	})}
																</Card.Subtitle>
																<Card.Text>
																	{texto.texto.substring(0, 50) + "..."}
																</Card.Text>
															</Card.Body>

															<Card.Body>
																<LinkContainer to={`/estudiar/${texto.id}`}>
																	<div className="btn-group">
																		{" "}
																		{/* ml-5 */}
																		<Button
																			variant="primary"
																			className="btn-sm " /* ml-5 */
																		>
																			ESTUDIAR TEXTO
																		</Button>
																	</div>
																</LinkContainer>
																<LinkContainer to={`/ModificarTexto/${texto.id}`}>
																	<Button
																		variant="light"
																		className="btn-sm  " /* ml-2 */
																	>
																		<i className="fas fa-edit"></i>
																	</Button>
																</LinkContainer>

																<Button
																	variant="danger"
																	className="btn-sm "
																	onClick={() => deleteHandler(texto.id)}
																>
																	<i className="fas fa-trash"></i>
																</Button>
															</Card.Body>

															<Card.Footer className="text-muted">
																{texto.fechaCreacion}
															</Card.Footer>
														</Card>
													</Col>
												))}
										</Row>
									</InfiniteScroll>
								) : (
									noHayTextos()
								)}
							</div>
						)}
					</div>
				</div>
			) : null}
		</div>
	);
}

export default VerTextosScreen;

/*
//async function eliminarTexto(id) {
	const { data } = await axios.delete(`/api/textos/delete/${id}/`);
	dispatch(getTextosDetails(userInfo.id));
}*/

/*
useEffect(() => {
	if (!userInfo) {
		history.push("/login?redirect=/verTextos");
	} else {
		dispatch(getTextosDetails(userInfo.id));
	}
}, [dispatch, history, userInfo]);*/
