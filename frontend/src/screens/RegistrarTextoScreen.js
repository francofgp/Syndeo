import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, Col, Row } from "react-bootstrap";
import { Container, Tooltip, OverlayTrigger } from "react-bootstrap";
import { registerTexto } from "../redux/actions/textosActions";
import Message from "../components/Message";
import Swal from "sweetalert2";
import { getIdiomas, getIdiomasUser } from "../redux/actions/IdiomasActions";
import { getCategorias } from "../redux/actions/categoriasActions";
import { getPalabras } from "../redux/actions/palabrasActions";
import { TEXTO_REGISTER_RESET } from "../redux/constants/textosConstans";
import Loader from "../components/Loader";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

function RegistrarTextoScreen({ history }) {
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const idiomas = useSelector((state) => state.idiomas);
	const { idiomasTotal, loading: loadingIdiomas } = idiomas;

	const categorias = useSelector((state) => state.categorias);
	const { categoriasTotal, loading: loadingCategorias } = categorias;

	const textos = useSelector((state) => state.textosRegister);
	const { error, success: successUpdateTexto, loading: loadingRegisterTexto } = textos;

	//const [name, setName] = useState("");
	const [idioma, setIdioma] = useState("");
	const [categoria, setCategoria] = useState("");
	const [texto, setTexto] = useState("");
	const [image, setImage] = useState("");
	const [audio, setAudio] = useState("");
	//const [youtube, setYoutube] = useState("");
	const [checkBoxAI, setCheckBoxAI] = useState(false);
	//const [autor, setAutor] = useState("");

	const [errorImagenMB, setErrorImagenMB] = useState(false);
	const [errorImagenFormato, setErrorImagenFormato] = useState(false);

	const [errorAudioMB, setErrorAudioMB] = useState(false);
	const [errorAudioFormato, setErrorAudioFormato] = useState(false);

	const dispatch = useDispatch();

	useEffect(() => {
		if (!userInfo) {
			history.push("/login?redirect=/RegistrarTexto");
		} else {
			dispatch(getIdiomas());
			dispatch(getCategorias());
		}
		if (successUpdateTexto) {
			dispatch(getIdiomasUser());
			dispatch(getPalabras());
			dispatch({ type: TEXTO_REGISTER_RESET });
			history.push("/verTextos");
		}
	}, [dispatch, history, userInfo, successUpdateTexto]);

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

	const submitHandler = (data) => {
		var longitud = data.texto.split(" ").length;
		var usuario = userInfo.id;
		let date = new Date();
		let fecha =
			date.toISOString().slice(0, 10) + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

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
				title: "Quieres guardar el texto?",
				showCancelButton: true,
				cancelButtonText: `Cancelar`,
				confirmButtonText: `Guardar`,
			})
			.then((result) => {
				if (result.isConfirmed) {
					dispatch(
						registerTexto(
							image,
							data.texto,
							fecha,
							usuario,
							data.name,
							categoria ? categoria : categorias.categoriasTotal[0].id,
							longitud,
							audio,
							idioma ? idioma : idiomas.idiomasTotal[0].id,
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

	if (successUpdateTexto) {
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
		dispatch({ type: TEXTO_REGISTER_RESET });
	}

	const uploadFileHandlerCover = async (e) => {
		try {
			if (e.target.files[0].size <= 5242880) {
				setImage(e.target.files[0]);
				setErrorImagenMB(false);
			} else {
				setErrorImagenMB(true);
				setImage("");
				//document.getElementById('image-file').value = '';
			}

			if (
				e.target.files[0].type === "image/jpeg" ||
				e.target.files[0].type === "image/jpg" ||
				e.target.files[0].type === "image/png"
			) {
				setImage(e.target.files[0]);
				setErrorImagenFormato(false);
			} else {
				setErrorImagenFormato(true);
				setImage("");
				//document.getElementById('image-file').value = '';
			}
		} catch (e) {
			console.log(e);
		}
	};

	const uploadAudioHandlerCover = async (e) => {
		try {
			if (e.target.files[0].size <= 10485760) {
				setAudio(e.target.files[0]);
				setErrorAudioMB(false);
			} else {
				setErrorAudioMB(true);
				setAudio("");
				//document.getElementById('audio-file').value = '';
			}

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
		} catch (e) {
			console.log(e);
		}
	};

	const estaActivadoElCheckBox = () => {
		if (checkBoxAI) {
			return true;
		}
		return false;
	};

	const redirectVerTextos = () => {
		history.push("/VerTextos");
	};

	//-----------------------------

	const validationSchema = Yup.object().shape({
		name: Yup.string().required("Campo obligatorio").max(30, "No puede tener más de 30 caracteres"),
		autor: Yup.string().max(30, "No puede tener más de 30 caracteres").notRequired(),
		youtubeURL: Yup.string()
			.notRequired()
			.default("")
			.nullable()
			.max(100, "No puede tener más de 100 caracteres")
			.matches(
				/^(?:(((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+))?)$/,
				"URL Incorrecta"
			),
		texto: Yup.string().required("Campo obligatorio").max(500, "No puede tener más de 500 caracteres"),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: yupResolver(validationSchema) });

	const onSubmit = (data) => {
		submitHandler(data);
	};

	//-----------------------------

	return (
		<div>
			<br />
			{userInfo ? (
				<div>
					<Container fluid>
						<Button variant="primary" onClick={redirectVerTextos} size="sm">
							<span>&#8592;</span> Textos
						</Button>

						<h1>
							<i className="fas fa-plus"></i> Texto
						</h1>
						{error && <Message variant="danger"> {error} </Message>}

						{loadingRegisterTexto || loadingIdiomas || loadingCategorias ? (
							<Loader />
						) : (
							<Form onSubmit={handleSubmit(onSubmit)}>
								<Row>
									<Col>
										<Form.Group controlId="name">
											<Form.Control
												//as="input"
												//required
												name="name"
												type="text"
												placeholder="Título"
												//value={name}
												//onChange={(e) =>
												//setName(e.target.value)
												//}
												{...register("name")}
												className={`form-control ${errors.name ? "is-invalid" : ""}`}
											></Form.Control>
											<div className="invalid-feedback">{errors.name?.message}</div>
										</Form.Group>
									</Col>
									<Col>
										<Form.Group controlId="autor">
											<Form.Control
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
												<select
													id="idioma"
													className="form-control"
													onChange={(e) => setIdioma(e.target.value)}
												>
													{idiomasTotal.map((obj) => {
														return (
															<option key={obj.id} value={obj.id}>
																{obj.name}
															</option>
														);
													})}
												</select>
											)}
										</Form.Group>
									</Col>
									<Col>
										<Form.Group controlId="categoria">
											<Form.Label>Categoría</Form.Label>

											{categoriasTotal !== "" && (
												<select
													id="categoria"
													className="form-control"
													onChange={(e) => setCategoria(e.target.value)}
												>
													{categoriasTotal.map((obj) => {
														return (
															<option key={obj.id} value={obj.id}>
																{obj.nombre}
															</option>
														);
													})}
												</select>
											)}
										</Form.Group>
									</Col>
								</Row>
								<Row>
									<Col>
										<Form.Group controlId="audio">
											<Form.File
												id="audio-file"
												label={audio.name ? audio.name : "Seleccione audio"}
												custom
												name="audio"
												disabled={checkBoxAI}
												onChange={uploadAudioHandlerCover}
											></Form.File>
											<div>
												<p class="error">
													{errorAudioMB ? "Archivo de más de 10 MB." : null}{" "}
													{errorAudioFormato
														? "Formato invalido (formatos validos: wav, mp3)."
														: null}{" "}
												</p>
											</div>
										</Form.Group>
									</Col>
									<Col>
										<Form.Group controlId="image">
											<Form.File
												type="file"
												id="image-file"
												label={image.name ? image.name : "Seleccione imagen"}
												custom
												name="imagen"
												onChange={uploadFileHandlerCover}
											></Form.File>
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

											<Col style={{ textAlign: "right" }}>
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
									<Form.Control
										name="youtubeURL"
										type="text"
										placeholder="URL YouTube"
										//onChange={(e) =>
										//	setYoutube(e.target.value)
										//}
										{...register("youtubeURL")}
										className={`form-control ${errors.youtubeURL ? "is-invalid" : ""}`}
									></Form.Control>
									<div className="invalid-feedback">{errors.youtubeURL?.message}</div>
								</Form.Group>

								<Form.Group controlId="texto">
									<Form.Control
										//required
										id="texto"
										name="texto"
										as="textarea"
										placeholder="Texto"
										style={{ height: "100px" }}
										/* maxlength="1500" */ //te corta automaticamente
										{...register("texto")}
										className={`form-control ${errors.texto ? "is-invalid" : ""}`}
									></Form.Control>

									<div className="invalid-feedback">{errors.texto?.message}</div>
									<p></p>

									{/*<div><p>Caracteres: {texto ? texto.length : 0}</p></div>*/}
								</Form.Group>

								<Button type="submit" variant="primary">
									Registrar
								</Button>
							</Form>
						)}
					</Container>
				</div>
			) : null}
		</div>
	);
}

export default RegistrarTextoScreen;
