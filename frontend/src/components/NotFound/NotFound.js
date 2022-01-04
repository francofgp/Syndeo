import React from "react";
import imagen from "../../data/imagenNotFoundScreen/notFound.webp"

import { Container, Row, Col } from "react-bootstrap";
const NotFound = () => {
	return (
		<section className="section position-relative">
			<Container>
				<Row className="align-items-center">
					<Col lg={6}>
						<div className="pr-lg-5">
						<h1>ERROR 404 - PAGINA NO ENCONTRADA</h1>
							<p className="text mb-4 pb-2">
							La pagina solicitada no se encuentra disponible en estos momentos.
							</p>
							<p className="text mb-4 pb-2">
							Esta perdido? Pruebe los siguientes enlaces:
							</p>
							<a href="/progreso" className="btn btn-primary">
								Ver progreso
								<span className="ml-2 right-icon">&#8594;</span>
							</a>
							<p></p>
							<a href="/verTextos" className="btn btn-primary">
								Ver textos
								<span className="ml-2 right-icon">&#8594;</span>
							</a>
							<p></p>
							<a href="/configuracionRepasar" className="btn btn-primary">
								Repasar palabras
								<span className="ml-2 right-icon">&#8594;</span>
							</a>							
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
};
export default NotFound;
