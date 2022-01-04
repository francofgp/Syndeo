import React, { useEffect, useState } from "react";
import imagen from "../data/imagenesActivarCuenta/imagenActivarCuenta.jpg";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

function ActivarCuentaScreen({ history, match, location }) {

	const userLogin = useSelector((state) => state.userLogin);
	const { error, loading, userInfo } = userLogin;

	const redirect = location.search ? location.search.split("=")[1] : "/";

	const dispatch = useDispatch();

	useEffect(() => {
		if (userInfo) {
			history.push(redirect);
		}
	}, [history, userInfo, redirect]);


	return (
		<section className="section position-relative">
			<Container>
				<Row className="align-items-center">
					<Col lg={6}>
						<div className="pr-lg-5">
							<h1>
								Se ha enviado un email para activar su cuenta
							</h1>
							<p className="text mb-4 pb-2">
								Por favor revise su bandeja de Spam.
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

export default ActivarCuentaScreen;
