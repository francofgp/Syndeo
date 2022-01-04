import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import audio from "../../data/imagenesHome/audio.jpg";
import syndeoLogo from "../../data/imagenesLogoSyndeo/LOGO AZUL.svg";

const FeatureBox = (props) => {
	return (
		<>
			{props.features.map((feature, key) =>
				feature.id % 2 !== 0 ? (
					<Row key={key} className={feature.id === 1 ? "align-items-center" : "align-items-center mt-5"}>
						<Col md={5}>
							<div>
								<img
									style={{
										height: "325px",
										width: "auto",
									}}
									src={feature.img}
									alt=""
									className="img-fluid d-block mx-auto"
								/>
							</div>
						</Col>
						<Col md={{ size: 6, offset: 1 }}>
							<div className="mt-5 mt-sm-0 mb-4">
								<div className="my-4">
									<i className={feature.icon}></i>
								</div>
								<h3 className="text-center title text-warning">{feature.title}</h3>
								<p className="text-muted text-center mb-3 f-15">{feature.desc}</p>
							</div>
						</Col>
					</Row>
				) : (
					<Row key={key} className="align-items-center mt-5">
						<Col md={6}>
							<div className="mb-4">
								<div className="my-4">
									<i className="mdi mdi-account-group"></i>
								</div>
								<h5 className="title ">{feature.title}</h5>
								<p className="text-muted mb-3 f-15">{feature.desc}</p>
								{/* <a
									href={feature.link}
									className="f-16 text-warning"
								>
									Read More{" "}
									<span className="right-icon ml-2">
										&#8594;
									</span>
								</a> */}
							</div>
						</Col>
						<Col md={{ size: 5, offset: 1 }} className="mt-5 mt-sm-0">
							<div>
								<img src={feature.img} alt="" className="img-fluid d-block mx-auto" />
							</div>
						</Col>
					</Row>
				)
			)}
		</>
	);
};
const AboutSyndeo = () => {
	const features = [
		{
			id: 1,
			img: syndeoLogo,
			title: "Sobre Syndeo",
			desc: "Syndeo es un conjunto de soluciones para reforzar tus conocimientos sobre idiomas, mediante la lectura. Te ofrecemos tener el control de tu aprendizaje, escogiendo los textos que desees leer, los horarios de estudio y la cantidad de repasos diarios o semanales. Te brindamos todas las métricas y estadísticas necesarias para que puedas ir controlando y organizando tu avance. La portabilidad no es un problema, ya que tenes acceso al sistema en cualquier momento y lugar.",
			link: "/",
		},
	];
	return (
		<section className="section" id="aboutSyndeo">
			<Container>
				<FeatureBox features={features} />
			</Container>
		</section>
	);
};
export default AboutSyndeo;
