import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import axios from "axios";
import es from "date-fns/locale/es";
import { PAISES } from "../data/paises";
import { getUserDetails, updateUserProfile } from "../redux/actions/userActions";
import { getIdiomas } from "../redux/actions/IdiomasActions";
import { USER_UPDATE_PROFILE_RESET } from "../redux/constants/userConstants";
import Swal from "sweetalert2";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

function ProfileScreen({ history }) {
	const userDetails = useSelector((state) => state.userDetails);
	const { error, loading, user } = userDetails;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
	const { success } = userUpdateProfile;

	const idiomas = useSelector((state) => state.idiomas);
	const { idiomasTotal } = idiomas;

	const [name, setName] = useState("");
	const [usuario, setUsuario] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState("");
	const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
	const [imagenPerfil, setImagenPerfil] = useState("");
	const [imagenPortada, setImagenPortada] = useState("");
	const [metaDiaria, setMetaDiaria] = useState("");
	const [imageCover, setImageCover] = useState("");
	const [uploading, setUploading] = useState(false);
	const [pais, setPais] = useState("");
	const [idioma, setIdioma] = useState("");
	const [apellido, setApellido] = useState("");
	const [sexo, setSexo] = useState("masculino");
	const [descripcion, setDescripcion] = useState("");

	const [errorImagenPefilMB, setErrorImagenPerfilMB] = useState(false);
	const [errorImagenPefilFormato, setErrorImagenPerfilFormato] = useState(false);

	const [errorImagenPortadaMB, setErrorImagenPortadaMB] = useState(false);
	const [errorImagenPortadaFormato, setErrorImagenPortadaFormato] = useState(false);

	const dispatch = useDispatch();

	var fechaNac = fechaNacimiento.toISOString().split("T")[0];
	const today = new Date();

	registerLocale("es", es);

	useEffect(() => {
		if (!userInfo) {
			history.push("/login?redirect=profile");
		} else {
			if (!user || !user.name || success) {
				dispatch({ type: USER_UPDATE_PROFILE_RESET });
				dispatch(getUserDetails("profile"));
				dispatch(getIdiomas());
			} else {
				//setName(user.name);
				//setEmail(user.email);
				setPais(user.pais);
				setIdioma(user.idioma);
				//setUsuario(user.username);
				setFechaNacimiento(new Date(user.fecha_nacimiento.replace(/-/g, "/")));
				setMetaDiaria(user.metaDiaria);
				//setApellido(user.last_name)
				setSexo(user.sexo);
				setDescripcion(user.descripcion);

				reset({
					nombre: user.name,
					email: user.email,
					usuario: user.username,
					apellido: user.last_name,
					descripcion: user.descripcion,
				});
			}
		}
	}, [dispatch, history, userInfo, user, success]);

	const submitHandler = (data) => {
		//e.preventDefault();
		if (password !== confirmPassword) {
			setMessage("Las contraseñas no coinciden");
		} else {
			//let paisNuevo = document.getElementById("pais").options[document.getElementById("pais").selectedIndex].text;
			let idiomaNuevo =
				document.getElementById("idioma").options[document.getElementById("idioma").selectedIndex].value;

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
					title: "¿Quiéres actualizar el perfil?",
					showCancelButton: true,
					cancelButtonText: `Cancelar`,
					confirmButtonText: `Guardar`,
				})
				.then((result) => {
					if (result.isConfirmed) {
						const usuarioAxios = {
							user: user._id,
							name: data.nombre,
							fechaNacimiento: fechaNac,
							email: data.email,
							username: data.usuario,
							password: data.password,
							pais: pais,
							idioma: idiomaNuevo,
							metaDiaria: metaDiaria,
							sexo: sexo,
							descripcion: data.descripcion,
							apellido: data.apellido,
						};

						console.log(usuarioAxios);
						dispatch(updateUserProfile(usuarioAxios));
						setMessage("");
						if (imagenPerfil !== null && imagenPerfil !== "") {
							uploadFileHandlerImagenPerfilAxios();
						} else if (imagenPortada !== null && imagenPortada !== "") {
							uploadFileHandlerImagenPortadaAxios();
						}
						const fireSuccess = Swal.mixin({
							customClass: {
								confirmButton: "btn btn-success",
							},
							buttonsStyling: false,
						});
						fireSuccess.fire("¡Guardado!", "", "success");
					} else if (result.isDenied) {
						const fireError = Swal.mixin({
							customClass: {
								confirmButton: "btn btn-danger",
							},
							buttonsStyling: false,
						});

						fireError.fire("Datos no guardados", "", "info");
					}
				});
		}
	};

	const uploadFileHandlerImagenPerfilAxios = async () => {
		const formData = new FormData();
		formData.append("imagePerfil", imagenPerfil);
		formData.append("id", user._id);
		setUploading(true);
		try {
			const config = {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			};
			const { data } = await axios.post("/api/users/profile/update/imageprofile", formData, config);

			setUploading(false);
		} catch (error) {
			setUploading(false);
		}

		if (imagenPortada !== null && imagenPortada !== "") {
			uploadFileHandlerImagenPortadaAxios();
		}
	};

	const uploadFileHandlerImagenPortadaAxios = async () => {
		const formData = new FormData();
		formData.append("image", imagenPortada);
		formData.append("id", user._id);
		setUploading(true);
		try {
			const config = {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			};
			const { data } = await axios.post("/api/users/profile/update/imagecover", formData, config);

			setUploading(false);
		} catch (error) {
			setUploading(false);
		}
	};

	const uploadFileHandlerImagenPerfil = async (e) => {
		console.log(e.target.files[0]);
		if (e.target.files[0].size <= 5242880) {
			setImagenPerfil(e.target.files[0]);
			setErrorImagenPerfilMB(false);
		} else {
			setErrorImagenPerfilMB(true);
			setImagenPerfil("");
		}

		if (
			e.target.files[0].type === "image/jpeg" ||
			e.target.files[0].type === "image/jpg" ||
			e.target.files[0].type === "image/png"
		) {
			setImagenPerfil(e.target.files[0]);
			setErrorImagenPerfilFormato(false);
		} else {
			setErrorImagenPerfilFormato(true);
			setImagenPerfil("");
		}
	};

	const uploadFileHandlerImagenPortada = async (e) => {
		if (e.target.files[0].size <= 5242880) {
			setImagenPortada(e.target.files[0]);
			setErrorImagenPortadaMB(false);
		} else {
			setErrorImagenPortadaMB(true);
			setImagenPortada("");
		}

		if (
			e.target.files[0].type === "image/jpeg" ||
			e.target.files[0].type === "image/jpg" ||
			e.target.files[0].type === "image/png"
		) {
			setImagenPortada(e.target.files[0]);
			setErrorImagenPortadaFormato(false);
		} else {
			setErrorImagenPortadaFormato(true);
			setImagenPortada("");
		}
	};

	const limpiarFormImagePerfil = () => {
		setImagenPerfil("");
	};

	const limpiarFormImagePortada = () => {
		setImagenPortada("");
	};

	//-------------------------------------------------------

	const validationSchema = Yup.object().shape({
		nombre: Yup.string().required("Campo obligatorio").max(30, "No puede tener más de 30 caracteres"),
		apellido: Yup.string().required("Campo obligatorio").max(30, "No puede tener más de 30 caracteres"),
		usuario: Yup.string().required("Campo obligatorio").max(30, "No puede tener más de 30 caracteres"),
		email: Yup.string()
			.required("Campo obligatorio")
			.matches(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				"Formato de Email incorrecto"
			)
			.max(60, "No puede tener más de 60 caracteres"),
		descripcion: Yup.string().notRequired().max(100, "No puede tener más de 100 caracteres"),
		password: Yup.string()
			.notRequired()
			.default("")
			.nullable()
			.matches(/^$|(?=^.{5,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, "Formato Incorrecto"),
		passwordConfirmation: Yup.string().oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden"),
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
			<br />
			{userInfo ? (
				<div>
					<Container fluid>
						<Row>
							<Col>
								<h2>Perfil</h2>
								{message && <Message variant="danger"> {message} </Message>}
								{error && <Message variant="danger"> {error} </Message>}

								{/*{loading && <Loader />}*/}
								{loading ? (
									<Loader />
								) : (
									<div>
										<Form onSubmit={handleSubmit(onSubmit)} md={10}>
											<Row>
												<Col>
													<Form.Group controlId="nombre">
														<Form.Label>Nombre</Form.Label>
														<Form.Control
															//required
															id="nombre"
															type="text"
															placeholder="Nombre"
															//value={name}
															//onChange={(e) =>
															//	setName(e.target.value)
															//}
															{...register("nombre")}
															className={`form-control ${
																errors.nombre ? "is-invalid" : ""
															}`}
														></Form.Control>
														<div className="invalid-feedback">{errors.nombre?.message}</div>
													</Form.Group>
												</Col>
												<Col>
													<Form.Group controlId="Apellido">
														<Form.Label>Apellido</Form.Label>
														<Form.Control
															//required
															id="apellido"
															type="text"
															placeholder="Apellido"
															//value={apellido}
															//onChange={(e) => setApellido(e.target.value)}
															{...register("apellido")}
															className={`form-control ${
																errors.apellido ? "is-invalid" : ""
															}`}
														></Form.Control>
														<div className="invalid-feedback">
															{errors.apellido?.message}
														</div>
													</Form.Group>
												</Col>
											</Row>

											<Form.Group controlId="usuario">
												<Form.Label>Usuario</Form.Label>
												<Form.Control
													//required
													id="usuario"
													type="text"
													placeholder="Usuario"
													//value={usuario}
													//onChange={(e) =>
													//		setUsuario(	e.target.value)
													//}
													{...register("usuario")}
													className={`form-control ${errors.usuario ? "is-invalid" : ""}`}
												></Form.Control>
												<div className="invalid-feedback">{errors.usuario?.message}</div>
											</Form.Group>

											<Form.Group controlId="email">
												<Form.Label>Email</Form.Label>
												<Form.Control
													//required
													id="email"
													type="text"
													//pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
													placeholder="Email"
													//value={email}
													//onChange={(e) =>
													//	setEmail(e.target.value)
													//}
													{...register("email")}
													className={`form-control ${errors.email ? "is-invalid" : ""}`}
												></Form.Control>
												<div className="invalid-feedback">{errors.email?.message}</div>
											</Form.Group>

											<Form.Group controlId="password">
												<Form.Label>Contraseña</Form.Label>
												<Form.Control
													id="password"
													type="password"
													placeholder="Nueva contraseña"
													//value={password}
													//onChange={(e) =>
													//	setPassword(
													//		e.target.value
													//	)
													//}
													{...register("password")}
													className={`form-control ${errors.password ? "is-invalid" : ""}`}
												></Form.Control>
												<div className="invalid-feedback">{errors.password?.message}</div>

												<Form.Text className="text-muted">
													Su contraseña debe contener como mínimo 6 caracteres e incluir al
													menos una mayúscula, una minúscula y un carácter especial.
												</Form.Text>
											</Form.Group>

											<Form.Group controlId="passwordConfirm">
												<Form.Label>Confirmar contraseña</Form.Label>
												<Form.Control
													id="passwordConfirm"
													type="password"
													placeholder="Confirmar su nueva contraseña"
													//value={confirmPassword}
													//onChange={(e) =>
													//	setConfirmPassword(
													//		e.target.value
													//	)
													//}
													{...register("passwordConfirmation")}
													className={`form-control ${
														errors.passwordConfirmation ? "is-invalid" : ""
													}`}
												></Form.Control>
												<div className="invalid-feedback">
													{errors.passwordConfirmation?.message}
												</div>
											</Form.Group>

											<Form.Group controlId="image">
												<Form.Label>Imagen de Perfil</Form.Label>

												<Form.File
													id="image-file-username"
													label={imagenPerfil.name ? imagenPerfil.name : "Seleccionar imagen"}
													custom
													onChange={uploadFileHandlerImagenPerfil}
												></Form.File>

												<div>
													<p class="error">
														{errorImagenPefilMB ? "Archivo de mas de 5 MB." : null}{" "}
														{errorImagenPefilFormato
															? "Formato invalido (formatos validos: jpg, png, jpeg)."
															: null}{" "}
													</p>
												</div>
												{/*}
													<Col>
														
														<Button
															style={{
																height: "45px",
																position: "absolute",
															}}
															onClick={
																limpiarFormImagePerfil
															}
														>
															X
														</Button>
													</Col>*/}
											</Form.Group>

											<Form.Group controlId="image">
												<Form.Label>Imagen de Portada</Form.Label>
												<Form.File
													id="image-file-profile"
													label={
														imagenPortada.name ? imagenPortada.name : "Seleccionar imagen"
													}
													custom
													onChange={uploadFileHandlerImagenPortada}
													accept="image/*"
													//style={{ width: "100%" }}
												></Form.File>
												<p class="error">
													{errorImagenPortadaMB ? "Archivo de mas de 5 MB." : null}{" "}
													{errorImagenPortadaFormato
														? "Formato invalido (formatos validos: jpg, png, jpeg)."
														: null}{" "}
												</p>

												{/*}
												<Button
													style={{
														height: "45px",
														position: "absolute",
													}}
													onClick={
														limpiarFormImagePortada
													}
												>
													X
												</Button>*/}
											</Form.Group>
											<Row>
												<Col>
													<Form.Group controlId="fechaNacimiento">
														<Form.Label>Fecha de nacimiento</Form.Label>
														<br />
														<DatePicker
															selected={fechaNacimiento}
															onChange={(date) => setFechaNacimiento(date)}
															className="form-control"
															locale="es"
															maxDate={today}
															showMonthDropdown
															showYearDropdown
															dropdownMode="select"
															dateFormat="yyyy-MM-dd"
														/>
													</Form.Group>
												</Col>
												<Col>
													<Form.Group controlId="pais">
														<Form.Label>Sexo</Form.Label>
														<select
															className="form-control"
															id="sexo"
															onChange={(e) => setSexo(e.target.value)}
															value={sexo}
														>
															<option value="maculino">Masculino</option>
															<option value="femenino">Femenino</option>
															<option value="otro">Otro</option>
														</select>
													</Form.Group>
												</Col>
											</Row>
											<Row>
												<Col>
													<Form.Group controlId="pais">
														<Form.Label>País</Form.Label>
														{PAISES !== "" && (
															<div>
																<select
																	id="pais"
																	className="form-control"
																	onChange={(e) => setPais(e.target.value)}
																	value={pais}
																>
																	{PAISES.map((obj) => {
																		return (
																			<option key={obj.id} value={obj.name}>
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
													<Form.Group controlId="idioma">
														<Form.Label>Idioma</Form.Label>
														{idiomasTotal !== "" && (
															<div>
																<select
																	id="idioma"
																	className="form-control"
																	//Value={idioma}
																	onChange={(e) => setIdioma(e.target.value)}
																>
																	{idiomasTotal.map((obj) => {
																		if (obj.name === idioma) {
																			return (
																				<option
																					key={obj.id}
																					value={obj.id}
																					selected
																				>
																					{" "}
																					{obj.name}{" "}
																				</option>
																			);
																		} else {
																			return (
																				<option key={obj.id} value={obj.id}>
																					{" "}
																					{obj.name}{" "}
																				</option>
																			);
																		}
																	})}
																</select>
															</div>
														)}
													</Form.Group>
												</Col>
											</Row>
											<Form.Group controlId="metaDiaria">
												<Form.Label>Meta diaria</Form.Label>
												<div>
													<select
														className="form-control"
														value={metaDiaria}
														onChange={(e) => setMetaDiaria(e.target.value)}
													>
														<option value="10">10</option>
														<option value="20">20</option>
														<option value="30">30</option>
														<option value="40">40</option>
														<option value="50">50</option>
													</select>
												</div>
											</Form.Group>
											<Form.Group>
												<Form.Label>Descripción</Form.Label>
												<Form.Control
													id="descripcion"
													as="textarea"
													rows={3}
													style={{ resize: "none" }}
													//value={descripcion}
													//onChange={(e) => setDescripcion(e.target.value)}
													{...register("descripcion")}
													className={`form-control ${errors.descripcion ? "is-invalid" : ""}`}
												></Form.Control>
												<div className="invalid-feedback">{errors.descripcion?.message}</div>
											</Form.Group>

											<Button type="submit" variant="primary">
												Actualizar
											</Button>
										</Form>
									</div>
								)}
							</Col>
						</Row>
					</Container>
				</div>
			) : null}
		</div>
	);
}

export default ProfileScreen;

/*
if (obj.name === pais) {

} else {
return (
<option
key={obj.name}
value={obj.name}
>
{obj.name}
</option>
);
}*/
