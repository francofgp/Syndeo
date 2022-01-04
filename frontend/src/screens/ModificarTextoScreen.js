import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { getIdiomas } from "../redux/actions/IdiomasActions";
import { Form, Button, Tooltip, OverlayTrigger, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getTextoDetails } from "../redux/actions/textosActions";
import { updateTexto } from "../redux/actions/textosActions";
import Message from "../components/Message";
import { TEXTO_UPDATE_RESET } from "../redux/constants/textosConstans";
import Loader from "../components/Loader";
import { getCategorias } from "../redux/actions/categoriasActions";
import Swal from "sweetalert2";
import { getPalabras } from "../redux/actions/palabrasActions";
import { getIdiomasUser } from "../redux/actions/IdiomasActions";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

function ModificarTextoScreen({ history, match }) {
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const idiomas = useSelector((state) => state.idiomas);
	const { idiomasTotal } = idiomas;

	const textoDB = useSelector((state) => state.textoInfo);
	const { textoInfo, loading: loadingTexto } = textoDB;

	const categorias = useSelector((state) => state.categorias);
	const { categoriasTotal } = categorias;

	const textosUpdate = useSelector((state) => state.textosUpdate);
	const { success, error, loading: loadingTextoUpdate } = textosUpdate;

	const [texto, setTexto] = useState("");
	//const [nombre, setNombre] = useState("");
	const [idioma, setIdioma] = useState("");
	//const [youtubeURL, setYoutube] = useState("");
	const [categoria, setCategoria] = useState("");
	const [id, setId] = useState("");
	const [imagen, setImagen] = useState("");
	const [audio, setAudio] = useState("");
	const [checkBoxAI, setCheckBoxAI] = useState(false);
	//const [autor, setAutor] = useState("");

	const [errorImagenMB, setErrorImagenMB] = useState(false);
	const [errorImagenFormato, setErrorImagenFormato] = useState(false);

	const [errorAudioMB, setErrorAudioMB] = useState(false);
	const [errorAudioFormato, setErrorAudioFormato] = useState(false);

	const dispatch = useDispatch();

	const textoID = match.params.id;

	useEffect(() => {
		if (userInfo) {
			if (success) {
				dispatch({ type: TEXTO_UPDATE_RESET });
				dispatch(getTextoDetails(textoID));
				dispatch(getIdiomasUser());
				dispatch(getPalabras());
			} else {
				if (!textoInfo.nombre || textoInfo.id !== Number(textoID)) {
					dispatch(getTextoDetails(textoID));
				} else {
					dispatch(getIdiomas());
					dispatch(getCategorias());
					setIdioma(textoInfo.idioma);
					setId(textoInfo.id);
					setCategoria(textoInfo.categoria);
					setTexto(textoInfo);

					reset({
						nombre: textoInfo.nombre,
						texto: textoInfo.texto,
						youtubeURL: textoInfo.youtubeURL,
						autor: textoInfo.autor,
					});
				}
			}
		} else {
			history.push("/login?redirect=/verTextos");
		}
	}, [dispatch, history, userInfo, textoID, success, textoInfo]);

	const submitHandler = (data) => {
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				denyButton: "btn btn-danger",
				cancelButton: "btn btn-primary",
				confirmButton: "btn btn-success",
			},
			buttonsStyling: false,
		});

		swalWithBootstrapButtons
			.fire({
				title: "¿Quiéres actualizar el texto?",
				showCancelButton: true,
				cancelButtonText: `Cancelar`,
				confirmButtonText: `Guardar`,
			})
			.then((result) => {
				if (result.isConfirmed) {
					dispatch(
						updateTexto(
							id,
							imagen,
							data.texto,
							data.nombre,
							categoria ? categoria : categorias.categoriasTotal[0].id,
							audio,
							idioma,
							data.youtubeURL,
							checkBoxAI,
							data.autor
						)
					);
				} else if (result.isDenied) {
					Swal.fire("Datos no guardados", "", "info");
				}
			});
	};

	const fireSuccess = Swal.mixin({
		customClass: {
			confirmButton: "btn btn-success",
		},
		buttonsStyling: false,
	});

	if (success) {
		fireSuccess.fire("¡Guardado!", "", "success");
	}

	const fireError = Swal.mixin({
		customClass: {
			confirmButton: "btn btn-danger",
		},
		buttonsStyling: false,
	});

	if (error) {
		fireError.fire(`Error al registrar el texto:`, `${error}`, "info");
		dispatch({ type: TEXTO_UPDATE_RESET });
	}

	const estaActivadoElCheckBox = () => {
		if (checkBoxAI) {
			return true;
		}
		return false;
	};

	const uploadFileHandlerCover = async (e) => {
		if (e.target.files[0].size <= 5242880) {
			setImagen(e.target.files[0]);
			setErrorImagenMB(false);
		} else {
			setErrorImagenMB(true);
			setImagen("");
			//document.getElementById('image-file').value = '';
		}

		if (
			e.target.files[0].type === "image/jpeg" ||
			e.target.files[0].type === "image/jpg" ||
			e.target.files[0].type === "image/png"
		) {
			setImagen(e.target.files[0]);
			setErrorImagenFormato(false);
		} else {
			setErrorImagenFormato(true);
			setImagen("");
			//document.getElementById('image-file').value = '';
		}
	};

	const uploadAudioHandlerCover = async (e) => {
		console.log(e.target.files[0]);
		if (e.target.files[0].size <= 10485760) {
			setAudio(e.target.files[0]);
			setErrorAudioMB(false);
		} else {
			setErrorAudioMB(true);
			setAudio("");
			//document.getElementById('audio-file').value = '';
		}
		console.log(e.target.files[0].type);
		if (
			e.target.files[0].type === "audio/wav" ||
			e.target.files[0].type === "audio/mp3" ||
			e.target.files[0].type === "audio/mpeg"
		) {
			setAudio(e.target.files[0]);
			setErrorAudioFormato(false);
		} else {
			setErrorAudioFormato(true);
			setAudio("");
			//document.getElementById('audio-file').value = '';
		}
	};

	const redirectVerTextos = () => {
		history.push("/VerTextos");
	};

	const limpiarFormImagen = () => {
		setImagen("");
	};

	const limpiarFormAudio = () => {
		setAudio("");
	};

	const renderTooltip = (props) => (
		<Tooltip id="button-tooltip" {...props}>
			<p>
				Con Syndeo AI podrás ser capaz de generar el audio asociado a tus textos, para esos casos en donde no
				dispones del audio correspondiente.
			</p>
			<br></br> <p>Actualmente Syndeo AI tiene soporte para los siguientes idiomas: </p>
			<ul>
				<li>Español</li>
				<li>Holandés</li>
				<li>Portugues</li>
				<li>Italiano</li>
				<li>Alemán</li>
				<li>Francés</li>
				<li>Inglés</li>
			</ul>
		</Tooltip>
	);

	//-------------------------------------------------------

	const validationSchema = Yup.object().shape({
		nombre: Yup.string().required("Campo obligatorio").max(30, "No puede tener más de 30 caracteres"),
		autor: Yup.string().notRequired().max(30, "No puede tener más de 30 caracteres"),
		youtubeURL: Yup.string()
			.notRequired()
			.default("")
			.nullable()
			.max(100, "No puede tener más de 100 caracteres")
			.matches(
				/^(?:(((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+))?)$/,
				"URL Incorrecta"
			),
		texto: Yup.string().required("Campo obligatorio").max(500, "No puede tener mas de 500"),
	});

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(validationSchema),
	});

	const onSubmit = (data) => {
		submitHandler(data);
	};

	//------------------------------------------------------

	return (
		<div>
			{userInfo ? (
				<div>
					<br />
					<Container fluid>
						<Button variant="primary" onClick={redirectVerTextos} size="sm">
							<span>&#8592;</span> Textos
						</Button>
						<h1>
							<i class="fas fa-edit"></i> Texto
						</h1>
						{error && <Message variant="danger"> {error} </Message>}
						{loadingTexto || loadingTextoUpdate ? (
							<Loader />
						) : (
							<div>
								<Form onSubmit={handleSubmit(onSubmit)}>
									<Row>
										<Col>
											<Form.Group controlId="nombre">
												<Form.Label>Titulo del texto</Form.Label>
												<Form.Control
													//required
													id="nombre"
													type="text"
													placeholder="Titulo"
													//value={nombre}
													//onChange={(e) =>
													//	setNombre(e.target.value)
													//}
													{...register("nombre")}
													className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
												></Form.Control>
												<div className="invalid-feedback">{errors.nombre?.message}</div>
											</Form.Group>
										</Col>
										<Col>
											<Form.Group controlId="autor">
												<Form.Label>Autor/Fuente</Form.Label>
												<Form.Control
													id="autor"
													name="autor"
													type="text"
													placeholder="Autor/Origen"
													//value={autor}
													//onChange={(e) =>
													//	setAutor(e.target.value)
													//}
													{...register("autor")}
													className={`form-control ${errors.autor ? "is-invalid" : ""}`}
												></Form.Control>
												<div className="invalid-feedback">{errors.autor?.message}</div>
											</Form.Group>
										</Col>
									</Row>

									<Row>
										<Col>
											<Form.Group controlId="idioma">
												<Form.Label>Idioma</Form.Label>
												{idiomasTotal !== "" && (
													<div>
														<select
															id="idioma"
															className="form-control"
															value={idioma}
															onChange={(e) => setIdioma(e.target.value)}
														>
															{idiomasTotal.map((obj) => {
																return (
																	<option key={obj.id} value={obj.id}>
																		{" "}
																		{obj.name}{" "}
																	</option>
																);
															})}
														</select>
													</div>
												)}
											</Form.Group>
										</Col>
										<Col>
											<Form.Group controlId="categorias">
												<Form.Label>Categoria</Form.Label>
												{categoriasTotal !== "" && (
													<div>
														<select
															id="idioma"
															className="form-control"
															value={categoria}
															onChange={(e) => setCategoria(e.target.value)}
														>
															{categoriasTotal.map((obj) => {
																return (
																	<option key={obj.id} value={obj.id}>
																		{" "}
																		{obj.nombre}{" "}
																	</option>
																);
															})}
														</select>
													</div>
												)}
											</Form.Group>
										</Col>
									</Row>
									<Row>
										<Col>
											<Form.Group controlId="audio">
												<Form.Label>Audio</Form.Label>
												<Form.File
													id="audio-file"
													label={audio ? audio.name : "Seleccionar audio"}
													custom
													disabled={checkBoxAI}
													onChange={uploadAudioHandlerCover}
												></Form.File>{" "}
												<div>
													<p class="error">
														{errorAudioMB ? "Archivo de mas de 10 MB." : null}{" "}
														{errorAudioFormato
															? "Formato invalido (formatos validos: wav, mp3)."
															: null}{" "}
													</p>
												</div>
												{/* <Button
											style={{
												height: "45px",
												position: "absolute",
											}}
											onClick={limpiarFormAudio}
										>
											X
										</Button>*/}
											</Form.Group>
										</Col>
										<Col>
											<Form.Group controlId="image">
												<Form.Label>Imagen</Form.Label>
												<Form.File
													type="file"
													id="image-file-profile"
													label={imagen ? imagen.name : "Seleccionar imagen"}
													custom
													accept="image"
													onChange={uploadFileHandlerCover}
												></Form.File>{" "}
												{/* 
										<Button
											style={{
												height: "45px",
												position: "absolute",
											}}
											onClick={limpiarFormImagen}
										>
											X
										</Button>*/}
												<div>
													<p class="error">
														{errorImagenMB ? "Archivo de mas de 5 MB." : null}{" "}
														{errorImagenFormato
															? "Formato invalido (formatos validos: jpg, png, jpeg)."
															: null}{" "}
													</p>
												</div>
											</Form.Group>
										</Col>
									</Row>

									<Row>
										<Col md={6}>
											<Row>
												<Col>
													<Form.Group controlId="formBasicCheckbox">
														<Form.Check
															type="checkbox"
															label="Generar audio con Syndeo AI"
															onChange={(e) => setCheckBoxAI(e.target.checked)}
														></Form.Check>
													</Form.Group>
												</Col>

												<Col
													style={{
														textAlign: "right",
													}}
												>
													<OverlayTrigger
														placement="right"
														delay={{
															show: 250,
															hide: 450,
														}}
														overlay={renderTooltip}
													>
														<Form.Label>
															¿Qué es Syndeo AI?
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="16"
																height="16"
																fill="currentColor"
																className="bi bi-info-circle"
																viewBox="0 0 16 16"
															>
																<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
																<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
															</svg>
														</Form.Label>
													</OverlayTrigger>
												</Col>
											</Row>
										</Col>
									</Row>

									<Form.Group controlId="youtube">
										<Form.Label>YouTubeURL</Form.Label>
										<Form.Control
											name="youtubeURL"
											id="youtube"
											type="text"
											placeholder="URL YouTube"
											//value={youtubeURL}
											//onChange={(e) =>
											//	setYoutube(e.target.value)
											//}
											{...register("youtubeURL")}
											className={`form-control ${errors.youtubeURL ? "is-invalid" : ""}`}
										></Form.Control>
										<div className="invalid-feedback">{errors.youtubeURL?.message}</div>
									</Form.Group>

									<Form.Group controlId="texto">
										<Form.Label>Texto</Form.Label>
										<Form.Control
											//required
											//type="name"
											id="texto"
											name="texto"
											as="textarea"
											placeholder="Texto"
											style={{ height: "200px" }}
											//value={texto}
											//onChange={(e) =>
											//	setTexto(e.target.value)
											//}
											{...register("texto")}
											className={`form-control ${errors.texto ? "is-invalid" : ""}`}
										></Form.Control>
										<div className="invalid-feedback">{errors.texto?.message}</div>
										<p></p>
										{/*	<div><p>Caracteres: {texto.texto ? texto.texto.length : 0}</p></div>*/}
									</Form.Group>

									<Button type="submit" variant="primary">
										Actualizar
									</Button>
								</Form>
							</div>
						)}
					</Container>
				</div>
			) : null}
		</div>
	);
}

export default ModificarTextoScreen;
