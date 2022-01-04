import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col, OverlayTrigger, Tooltip, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
//Data Picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";

import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";

import { registerUsuario } from "../redux/actions/userActions";
import { getIdiomas } from "../redux/actions/IdiomasActions";
import { PAISES } from "../data/paises";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { USER_REGISTER_RESET } from "../redux/constants/userConstants";

function RegisterScreen({ location, history }) {
	const userRegister = useSelector((state) => state.userRegister);
	const { error, loading, userInfo, success } = userRegister;

	const idiomas = useSelector((state) => state.idiomas);
	const { idiomasTotal } = idiomas;

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [usuario, setUsuario] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState("");
	const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
	//const [idiomasDB, setIdiomasDB] = useState("");
	const [pais, setPais] = useState("");
	const [idioma, setIdioma] = useState("");
	const [sexo, setSexo] = useState("masculino");
	const [apellido, setApellido] = useState("");

	const dispatch = useDispatch();

	const redirect = location.search ? location.search.split("=")[1] : "/";
	//data picker
	const today = new Date();
	registerLocale("es", es);

	//Tooltip, info para mouseOver action
	const renderTooltip = (props) => (
		<Tooltip id="button-tooltip" {...props}>
			El idoma seleccionado será el idioma destino para el cual se realizarán las traducciones automáticas,
			siempre puede volver a su perfil y modificarlo.
		</Tooltip>
	);

	useEffect(() => {
		if (userInfo) {
			if (userInfo.isActive) {
				history.push(redirect);
			}
		} else {
			dispatch(getIdiomas());
		}
		if (success) {
			dispatch({ type: USER_REGISTER_RESET });
			history.push("/activarCuenta");
		}
	}, [history, userInfo, redirect, dispatch, success]);

	const submitHandler = (data) => {
		//e.preventDefault();
		if (password !== confirmPassword) {
			setMessage("Password do not match");
		} else {
			dispatch(
				registerUsuario(
					data.nombre,
					data.email,
					data.usuario,
					data.password,
					pais ? pais : PAISES[0].name,
					idioma ? idioma : idiomasTotal[0].id,
					fechaNacimiento,
					sexo,
					data.apellido
				)
			);
		}
	};

	//-------------------------
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
		password: Yup.string()
			.required("Campo obligatorio")
			.matches(/(?=^.{5,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, "Formato Incorrecto"),
		passwordConfirmation: Yup.string().oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden"),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(validationSchema),
	});

	const onSubmit = (data) => {
		submitHandler(data);
	};

	//--------------------------

	const renderErrores = () => {
		for (var key in error) {
			if (error.hasOwnProperty(key)) {
				if (key === "username") {
					//return <Message variant="danger"> {error[key][0]} </Message>;
					return <Message variant="danger"> El nombre de usuario no se encuentra disponible </Message>;
				} else if (key === "email") {
					return <Message variant="danger"> El email ya está en uso </Message>;
				} else {
					return <Message variant="danger">{error[key][0]}</Message>;
				}
			}
		}
	};
	return (
		<Container>
			<h1>REGÍSTRATE</h1>
			{message && <Message variant="danger"> {message} </Message>}
			{error && renderErrores()}
			{loading && <Loader />}
			<Form onSubmit={handleSubmit(onSubmit)} md={10}>
				<Row>
					<Col>
						<Form.Group controlId="nombre">
							<Form.Control
								//required
								type="text"
								placeholder="Nombre"
								//value={name}
								//onChange={(e) => setName(e.target.value)}
								{...register("nombre")}
								className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
							></Form.Control>
							<div className="invalid-feedback">{errors.nombre?.message}</div>
						</Form.Group>
					</Col>
					<Col>
						<Form.Group controlId="Apellido">
							<Form.Control
								//required
								id="nombre"
								type="text"
								placeholder="Apellido"
								//value={apellido}
								//onChange={(e) => setApellido(e.target.value)}
								{...register("apellido")}
								className={`form-control ${errors.apellido ? "is-invalid" : ""}`}
							></Form.Control>
							<div className="invalid-feedback">{errors.apellido?.message}</div>
						</Form.Group>
					</Col>
				</Row>
				<Form.Group controlId="usuario">
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
						Su contraseña debe contener como mínimo 6 caracteres e incluir al menos una mayúscula, una
						minúscula y un carácter especial.
					</Form.Text>
				</Form.Group>

				<Form.Group controlId="passwordConfirm">
					<Form.Control
						id="passwordConfirm"
						type="password"
						placeholder="Confirme su nueva contraseña"
						//value={confirmPassword}
						//onChange={(e) =>
						//	setConfirmPassword(
						//		e.target.value
						//	)
						//}
						{...register("passwordConfirmation")}
						className={`form-control ${errors.passwordConfirmation ? "is-invalid" : ""}`}
					></Form.Control>
					<div className="invalid-feedback">{errors.passwordConfirmation?.message}</div>
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

							<select className="form-control" id="sexo" onChange={(e) => setSexo(e.target.value)}>
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
									>
										{PAISES.map((obj) => {
											return (
												<option key={obj.name} value={obj.name}>
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
							<OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
								<Form.Label>
									Idioma
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

							{idiomasTotal !== "" && (
								<div className="dropdown show">
									<select
										id="idioma"
										className="form-control"
										onChange={(e) => setIdioma(e.target.value)}
									>
										{idiomasTotal.map((obj) => {
											return (
												<option key={obj.name} value={obj.id}>
													{obj.name}
												</option>
											);
										})}
									</select>
								</div>
							)}
						</Form.Group>
					</Col>
				</Row>

				<Form.Group>
					<Button type="submit" variant="primary">
						REGISTRARTE
					</Button>
					<Form.Text className="text-muted">
						Al registrarse o utilizar este sitio web, usted acepta estos{" "}
						<a href="https://syndeo.s3.us-east-2.amazonaws.com/T%C3%A9rminos+y+Condiciones+de+Uso+para+SYNDEO.pdf">
							{" "}
							Términos y Condiciones
						</a>
						.
					</Form.Text>
				</Form.Group>
			</Form>
			<Row className="py-3">
				<Col>
					¿Tiene cuenta? <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}> Inicie sesión</Link>
				</Col>
			</Row>
		</Container>
	);
}

export default RegisterScreen;

/*
				//async function fetchIdiomas() {
					const { data } = await axios.get(`/api/idiomas/`);
		
					setIdiomasDB(data);
				}
		
				fetchIdiomas();
		*/

/*
	  var pais = document.getElementById("pais").options[ document.getElementById("pais").selectedIndex	].value;
	  var idioma = document.getElementById("idioma").options[document.getElementById("idioma").selectedIndex].value;
	  		*/
