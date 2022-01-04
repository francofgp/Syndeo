import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { login } from "../redux/actions/userActions";
import { resetPassword } from "../redux/actions/userActions";
import { PASSWORD_RESET_RESET } from "../redux/constants/userConstants";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

function RecoveryPasswordScreen({ location, history }) {
	const userLogin = useSelector((state) => state.userLogin);
	const { error, loading, userInfo } = userLogin;

	const resetPassRedux = useSelector((state) => state.resetPassword);
	const {
		error: errorReset,
		success: successReset,
		loading: loadingReset,
	} = resetPassRedux;

	const [email, setEmail] = useState("");

	//const [mensajeMailEnviado, setMailEnviado] = useState(false);
	//const [mensajeErrorReset, setMensajeErrorReset] = useState(false);

	const dispatch = useDispatch();

	const redirect = location.search ? location.search.split("=")[1] : "/";

	// location todos los datos de la ruta desde donde vengo, por eso hago el redirect
	// por si vengo de checkout sin login luego de login me mande a el checkout
	// pj si vengo de chackout {pathname: "/login", search: "?redirect=shipping", hash: "", state: undefined, key: "mzuav8"}

	useEffect(() => {
		if (userInfo) {
			history.push(redirect);
		} else {
			dispatch({ type: PASSWORD_RESET_RESET });
		}
	}, [history, userInfo, redirect]);

	const submitHandler = (data) => {
		dispatch(resetPassword(data.email));
	};

	const validationSchema = Yup.object().shape({
		email: Yup.string()
			.required("Campo obligatorio")
			.matches(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				"Formato de Email incorrecto"
			),
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

	return (
		<FormContainer>
			<div>
				<h3>¿Has Olvidado Tu Contraseña?</h3>
				{errorReset && (
					<Message variant="danger">
						{" "}
						{"Ocurrio un error, pruebe nuevamente"}{" "}
					</Message>
				)}
				{!loadingReset && !successReset && (
					<p>
						Introduce tu dirección de correo electrónico y te
						enviaremos un enlace para crear una nueva contraseña.
					</p>
				)}
			</div>
			{/*  {successReset && <Message variant="info"> {'Mail enviado, revise su inbox'} </Message>}*/}
			{loading && <Loader />}
			{!loadingReset && !successReset ? (
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Form.Group controlId="email">
						<Form.Control
							type="email"
							placeholder="Correo electronico"
							{...register("email")}
							className={`form-control ${
								errors.email ? "is-invalid" : ""
							}`}
						></Form.Control>
						<div className="invalid-feedback">
							{errors.email?.message}
						</div>
					</Form.Group>
					<Button
						type="submit"
						variant="primary"
						disabled={loadingReset || successReset}
					>
						{" "}
						Enviar
					</Button>
				</Form>
			) : !successReset ? (
				<Loader />
			) : (
				<h6>
					Te hemos enviado un correo electrónico con un enlace para
					restablecerla.
				</h6>
			)}
		</FormContainer>
	);
}

export default RecoveryPasswordScreen;
