import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import classes from "../styles/ProfileCard.module.css";
import { isMobileOnly, isTablet } from "react-device-detect";

const ProfileCard = ({
	nombre,
	imagenPerfil,
	imagenPortada,
	edad,
	pais,
	cantidadTextosLeidos,
	cantidadPalabrasLeidas,
	cantidadVocabulario,
	descripcion,
}) => {
	console.log(isMobileOnly, isTablet);
	return (
		<div>
			<Container className="">
				<Card className={isMobileOnly ? classes.ProfileCardMobile : `${classes.ProfileCard} `}>
					<Card.Img
						data-tut="foto-portada-perfil"
						className={
							isMobileOnly ? classes.ProfileCardBackgroundImageMobile : classes.ProfileCardBackgroundImage
						}
						alt="Background Image"
						variant="top"
						src={imagenPortada}
						fluid
					/>
					<Card.Img
						data-tut="foto-perfil"
						className={isMobileOnly ? classes.ProfileCardImageMobile : classes.ProfileCardImage}
						alt="User Image"
						variant="top"
						src={imagenPerfil}
						fluid
					/>
					<Card.Body data-tut="body-perfil" className={"text-center " + classes.ProfileCardBody}>
						<Row className={`text-center  ${isMobileOnly ? classes.PaddingMobile : classes.Padding}`}>
							<Col>
								<Card.Text
									className={isMobileOnly ? `${classes.TextBoldMobile}` : classes.TextBold + " "}
								>
									{nombre}{" "}
									<span className={isMobileOnly ? classes.TextMutedMobile : classes.TextMuted + " "}>
										{edad}
									</span>
								</Card.Text>
								<Card.Text className={isMobileOnly ? classes.TextMutedMobile : classes.TextMuted}>
									{pais}
								</Card.Text>
							</Col>
						</Row>
						<Card.Text
							style={{ textAlign: "center" }}
							className={isMobileOnly ? classes.DescripcionMobile : `${classes.Descripcion}`}
						>
							<p>{descripcion}</p>
						</Card.Text>
					</Card.Body>
					<Card.Footer className={isMobileOnly ? classes.CardFooterMobile : classes.CardFooter}>
						<Row data-tut="stats-perfil" xs="3" className="text-center mb-1">
							<Col data-tut="textos-leidos">
								<Card.Text className={classes.TextBold + " " + classes.FooterP}>
									{cantidadTextosLeidos}
								</Card.Text>
								<Card.Text className={classes.TextMuted}>Textos Leídos</Card.Text>
							</Col>
							<Col data-tut="palabras-leidas">
								<Card.Text className={classes.TextBold + " " + classes.FooterP}>
									{cantidadPalabrasLeidas}
								</Card.Text>
								<Card.Text className={classes.TextMuted}>Palabras Leídas</Card.Text>
							</Col>
							<Col data-tut="vocabulario-perfil">
								<Card.Text className={classes.TextBold + " " + classes.FooterP}>
									{cantidadVocabulario}
								</Card.Text>
								<Card.Text className={classes.TextMuted}>Vocabulario</Card.Text>
							</Col>
						</Row>
					</Card.Footer>
				</Card>
			</Container>
		</div>
	);
};

export default ProfileCard;
