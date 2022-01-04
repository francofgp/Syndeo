import React from "react";
import { Container, Row, Col } from "react-bootstrap";
const About = () => {
	return (
		<section className="section" /* bg-light" */ id="about">
			<Container>
				<Row className="justify-content-center">
					<Col lg={6} md={8}>
						<div className="title text-center mb-5">
							<h3 className="font-weight-normal text-dark">
								<span className="text-warning">Nosotros</span>
							</h3>

							<p className="text-muted">
								DreamTeam™ nació en el año 2017 en el interior de Córdoba, más precisamente en la
								localidad de Villa María. Este equipo se mantuvo a lo largo de todo nuestro paso por la
								UTN. Llegando al final de este ciclo, y para poner un broche a la altura de nuestro paso
								por esta casa de estudios, es por lo que nace Syndeo.
							</p>
						</div>
					</Col>
				</Row>
				<Row>
					<Col md={4}>
						<h2 className="font-weight-light line-height-1_6 text-dark mb-4">
							SYNDEO, DONDE EL APRENDIZAJE SE VUELVE DIVERTIDO.
						</h2>
					</Col>
					<Col md={{ size: 7, offset: 1 }}>
						<Row>
							<Col md={6}>
								<h6 className="text-dark font-weight-light f-20 mb-3">Nuestra Misión</h6>
								<p className="text-muted font-weight-light text-justify">
									Contribuir al desarrollo cualitativo y a la extensión de la educación y la cultura
									lingüística en condiciones de equidad. Brindando una manera ágil y divertida de
									lograrlo.
								</p>
							</Col>
							<Col md={6}>
								<h6 className="text-dark font-weight-light f-20 mb-3">Nuestra Visión</h6>
								<p className="text-muted font-weight-light text-justify">
									Hacer de Syndeo la herramienta principal entre los estudiantes de idiomas que deseen
									aprender mediante el goce de la lectura.
								</p>
							</Col>
						</Row>
					</Col>
				</Row>
			</Container>
		</section>
	);
};
export default About;
