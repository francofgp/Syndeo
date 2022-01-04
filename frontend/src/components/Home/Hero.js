import React from "react";
import { Form, Button } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import imagenHeroHome from "../../data/imagenesHome/Hero.jpg";
const Hero = () => {
	let history = useHistory();

	const redirectRegistrar = () => {
		history.push("/register");
	};

	return (
		<section className="section position-relative" id="hero">
			<Container>
				<Row className="align-items-center">
					<Col lg={6}>
						<div className="pr-lg-5">
							<p className="text-uppercase text-primary font-weight-medium f-14 mb-4">
								2021
							</p>
							<h1 className="mb-4 font-weight-normal line-height-1_4">
								Bienvenidos a{" "}
								<span className="titulo-css text-primary font-weight-medium">
									Syndeo
								</span>
							</h1>
							<p className="text-muted mb-4 pb-2">
							Syndeo es la plataforma donde podrás 
							traer todos tus artículos preferidos 
							para disfrutar de una lectura placentera y 
							en el idioma que gustes, en tiempo real.
							</p>
							<Button
								variant="primary"
								onClick={redirectRegistrar}
							>
								Regístrese{" "}
								<span className="ml-2 right-icon">&#8594;</span>
							</Button>
						</div>
					</Col>
					<Col lg={6}>
						<div className="mt-5 mt-lg-0">
							<img
								id="imagen-con-movimiento"
								src={imagenHeroHome}
								/* src="https://img.freepik.com/free-vector/business-team-brainstorm-idea-lightbulb-from-jigsaw-working-team-collaboration-enterprise-cooperation-colleagues-mutual-assistance-concept-pinkish-coral-bluevector-isolated-illustration_335657-1651.jpg?size=626&ext=jpg" */
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
export default Hero;
