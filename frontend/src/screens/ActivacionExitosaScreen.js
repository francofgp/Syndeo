import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import imagen from "../data/imagenesActivarCuenta/imagenActivacionExitosa.jpg";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { activateAccount } from "../redux/actions/userActions";
import { USER_LOGOUT } from "../redux/constants/userConstants";

function ActivacionExitosaScreen({ history, match }) {
	const dispatch = useDispatch();

	const token = match.params.token;
	const uid = match.params.uid;

	useEffect(() => {
		dispatch({ type: USER_LOGOUT });
		dispatch(activateAccount(uid, token));
	}, []);

	return (
		<section className="section position-relative">
			<Container>
				<Row className="align-items-center">
					<Col lg={6}>
						<div className="pr-lg-5">
							<h1>Su cuenta se ha activado con éxito</h1>
							<p className="text mb-4 pb-2">
								Ya puede{" "}
								<span style={{ fontWeight: 800 }}>
									<Link to={`/login`}> iniciar sesión</Link>
								</span>{" "}
								para comenzar a usar Syndeo!
							</p>
						</div>
					</Col>
					<Col lg={6}>
						<div className="mt-5 mt-lg-0">
							<img
								id="imagen-con-movimiento"
								src={imagen}
								alt=""
								className="img-fluid mx-auto d-block imagen-con-movimiento"
							/>
						</div>
					</Col>
				</Row>
			</Container>
		</section>
	);
}

export default ActivacionExitosaScreen;
