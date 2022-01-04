import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { login } from "../redux/actions/userActions";
import { resetPasswordConfirm } from "../redux/actions/userActions";
import { PASSWORD_RESET_CONFIRM_RESET } from "../redux/constants/userConstants";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

function RecoveryPasswordConfirmScreen({ history, match, location }) {
	const userLogin = useSelector((state) => state.userLogin);
	const { error, loading, userInfo } = userLogin;

	const resetPassRedux = useSelector((state) => state.resetPasswordConfirm);
	const {
		error: errorReset,
		success: successReset,
		loading: loadingReset,
	} = resetPassRedux;

	const dispatch = useDispatch();

	const token = match.params.token;
	const uid = match.params.uid;

	const redirect = location.search ? location.search.split("=")[1] : "/";

	useEffect(() => {
		if (userInfo) {
			history.push(redirect);
		} else {
			dispatch({ type: PASSWORD_RESET_CONFIRM_RESET });
		}
	}, [history, userInfo, redirect]);

	const submitHandler = (data) => {
		dispatch(resetPasswordConfirm(uid, token, data.password));
	};

	const validationSchema = Yup.object().shape({
		password: Yup.string()
			.required("Campo obligatorio")
			.default("")
			.nullable()
			.matches(
				/^$|(?=^.{5,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
				"Formato Incorrecto"
			),
		passwordConfirmation: Yup.string().oneOf(
			[Yup.ref("password"), null],
			"Las contraseñas no coinciden"
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
		<div>
			<FormContainer>
				<h3>Cambie su contraseña</h3>
				{loading && <Loader />}
				{/* {successReset && <Message variant="info"> {'Contraseña cambiada con exito'} </Message>}*/}
				{errorReset && (
					<Message variant="danger">
						{" "}
						{"Error, pruebe nuevamente"}{" "}
					</Message>
				)}
				{!loadingReset && !successReset ? (
					<Form onSubmit={handleSubmit(onSubmit)}>
						<Form.Group controlId="password">
							<Form.Control
								type="password"
								placeholder="Nueva contraseña"
								{...register("password")}
								className={`form-control ${
									errors.password ? "is-invalid" : ""
								}`}
							></Form.Control>
							<div className="invalid-feedback">
								{errors.password?.message}
							</div>
						</Form.Group>

						<Form.Group controlId="password">
							<Form.Control
								type="password"
								placeholder="Confirmar nueva contraseña"
								{...register("passwordConfirmation")}
								className={`form-control ${
									errors.passwordConfirmation
										? "is-invalid"
										: ""
								}`}
							></Form.Control>
							<div className="invalid-feedback">
								{errors.passwordConfirmation?.message}
							</div>
						</Form.Group>

						<Button type="submit" variant="primary">
							{" "}
							Cambiar
						</Button>
					</Form>
				) : !successReset ? (
					<Loader />
				) : (
					<h5>Contraseña modificada con éxito.</h5>
				)}
			</FormContainer>
		</div>
	);
}

export default RecoveryPasswordConfirmScreen;
