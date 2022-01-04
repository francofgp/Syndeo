import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import audio from "../../data/imagenesHome/audio.jpg";
import vocabulario from "../../data/imagenesHome/vocabulario.jpg";
import flashCards from "../../data/imagenesHome/flashCards.jpg";

const FeatureBox = (props) => {
	return (
		<>
			{props.features.map((feature, key) =>
				feature.id % 2 !== 0 ? (
					<Row
						key={key}
						className={
							feature.id === 1
								? "align-items-center"
								: "align-items-center mt-5"
						}
					>
						<Col md={5}>
							<div>
								<img
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
								<h5 className="text-dark font-weight-normal mb-3 pt-3">
									{feature.title}
								</h5>
								<p className="text-muted mb-3 f-15">
									{feature.desc}
								</p>
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
					</Row>
				) : (
					<Row key={key} className="align-items-center mt-5">
						<Col md={6}>
							<div className="mb-4">
								<div className="my-4">
									<i className="mdi mdi-account-group"></i>
								</div>
								<h5 className="text-dark font-weight-normal mb-3 pt-3">
									{feature.title}
								</h5>
								<p className="text-muted mb-3 f-15">
									{feature.desc}
								</p>
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
						<Col
							md={{ size: 5, offset: 1 }}
							className="mt-5 mt-sm-0"
						>
							<div>
								<img
									src={feature.img}
									alt=""
									className="img-fluid d-block mx-auto"
								/>
							</div>
						</Col>
					</Row>
				)
			)}
		</>
	);
};
const Feature = () => {
	const features = [
		{
			id: 1,
			img: audio,
			/* "https://img.freepik.com/free-vector/group-therapy-illustration-concept_52683-45727.jpg?size=626&ext=jpg&ga=GA1.2.1479878331.1625788800" */ title: "Generación de audio automática",
			desc: "¿Tienes un texto que quieres leer, pero no tienes el audio? No importa, Syndeo te generará uno automáticamente para que lo acompañes con la lectura.",
			link: "/",
		},
		{
			id: 2,
			img: vocabulario /* "https://img.freepik.com/free-vector/shared-working-environment-illustration_171919-3.jpg?size=338&ext=jpg", */,
			title: "Seguimiento de vocabulario",
			desc: "¿Alguna vez haz intentado leer y estar marcando las palabras que no recuerdas al mismo tiempo? Es aburrido ¿Verdad? Syndeo te permite llevar el seguimiento de las mismas sin el menor esfuerzo.",
			link: "/",
		},
		{
			id: 3,
			img: flashCards /* "https://image.freepik.com/free-vector/online-job-interview-illustration_23-2148642106.jpg" */,
			title: "Flashcards",
			desc: "Syndeo te brinda la posibilidad de estudiar las palabras de tu vocabulario mediante flashcards, que puedes configurar a tu gusto.",
			link: "/",
		},
	];
	return (
		<section className="section" id="feature">
			<Container>
				<Row className="justify-content-center">
					<Col lg={6} md={8}>
						<div className="title text-center mb-5">
							<h3 className="font-weight-normal text-dark">
								<span className="text-warning">
									Características
								</span>
							</h3>
							<p className="text-muted">
								Syndeo se caracteriza por ser la plataforma que
								hace que la lectura de artículos en tu idioma
								objetivo sea lo más placentera posible, haciendo
								que disfrutes de la literatura y el aprendizaje
								del idioma que viene de la misma.
							</p>
						</div>
					</Col>
				</Row>
				<FeatureBox features={features} />
			</Container>
		</section>
	);
};
export default Feature;
