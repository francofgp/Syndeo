import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { login } from "../redux/actions/userActions";

function LoginScreen({ location, history }) {
	const userLogin = useSelector((state) => state.userLogin);
	const { error, loading, userInfo } = userLogin;

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showError, setShowError] = useState(false);

	const dispatch = useDispatch();

	const redirect = location.search ? location.search.split("=")[1] : "/";

	// location todos los datos de la ruta desde donde vengo, por eso hago el redirect
	// por si vengo de checkout sin login luego de login me mande a el checkout
	// pj si vengo de chackout {pathname: "/login", search: "?redirect=shipping", hash: "", state: undefined, key: "mzuav8"}

	useEffect(() => {
		if (userInfo) {
			history.push(redirect);
		}
	}, [history, userInfo, redirect]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(login(email, password));
		setShowError(true);
	};

	return (
		<FormContainer>
			{/* todo lo que este entee <FormContainer> </FormContainer> se pasa como parametro "children" al componente FormContainer*/}
			<h1>Iniciar sesión</h1>
			{error && showError && (
				<Message variant="danger"> {"Credenciales invalidas"} </Message>
			)}
			{loading && <Loader />}
			<Form onSubmit={submitHandler}>
				<Form.Group controlId="email">
					<Form.Control
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Form.Group controlId="password">
					<Form.Control
						type="password"
						placeholder="Contraseña"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Button type="submit" variant="primary">
					{" "}
					Ingresar
				</Button>
			</Form>

			<Row className="py-3">
				<Col md={6}>
					¿Nuevo usuario?{" "}
					<Link
						to={
							redirect
								? `/register?redirect=${redirect}`
								: "/register"
						}
					>
						{" "}
						Regístrate
					</Link>
				</Col>
				<Col md={6} style={{ "text-align": "right" }}>
					<Link to={`/reiniciarPass`}>
						{" "}
						¿Olvidaste tu contraseña?
					</Link>
				</Col>
			</Row>
		</FormContainer>
	);
}

export default LoginScreen;
