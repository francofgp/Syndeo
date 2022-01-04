import React, { useState } from "react";
import PropTypes from "prop-types";
import ReactCardFlip from "react-card-flip";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import flechaIzquierdaLogo from "../../data/imagenFlashCards/flechaIzquierda.svg";
import flechaDerechaLogo from "../../data/imagenFlashCards/flechaDerecha.svg";
import sonidoLogo from "../../data/imagenFlashCards/sonido.svg";
import { isMobile } from "react-device-detect";

export const FlashcardComponent = ({
	dataSource = [],
	flipDirection,
	onSound,
	onChange,
	onFinish,
	onFinishVerPalabras,
	codigoIdioma,
	codigoIdiomaNativo,
	modo,
}) => {
	const [step, setStep] = useState(1);
	const [side, setSide] = useState("front");
	const [isFinish, setIsFinish] = useState(false);

	let history = useHistory();

	const handleChangeSide = () => {
		const newSide = side === "front" ? "back" : "front";
		setSide(newSide);
		onChange(step, newSide);
	};

	const handlePrev = () => {
		const prevStep = step > 1 ? step - 1 : 1;
		setSide("front");
		setStep(prevStep);
		onChange(prevStep, "front");
	};

	const handleNext = () => {
		const max = dataSource.length;
		setIsFinish(step + 1 > max);
		const nextStep = step < max ? step + 1 : max;
		setSide("front");
		setStep(nextStep);
		onChange(nextStep, "front");
	};

	const handleSpeaker = () => {
		const text = dataSource[step - 1][side].text;
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = codigoIdioma ? codigoIdioma : "en-US";
		if (side === "front" && modo === "nativo") {
			utterance.lang = codigoIdiomaNativo ? codigoIdiomaNativo : "en-US";
		}
		if (side === "back" && modo === "nativo") {
			utterance.lang = codigoIdioma ? codigoIdioma : "en-US";
		}
		if (side === "front" && modo === "objetivo") {
			utterance.lang = codigoIdioma ? codigoIdioma : "en-US";
		}
		if (side === "back" && modo === "objetivo") {
			utterance.lang = codigoIdiomaNativo ? codigoIdiomaNativo : "en-US";
		}

		window.speechSynthesis.cancel();
		window.speechSynthesis.speak(utterance);
		onSound(text);
	};

	const handleStartOver = () => {
		setStep(1);
		setSide("front");
		setIsFinish(false);
	};

	return (
		<div style={Styles.container}>
			{isFinish ? (
				<div style={Styles.finishContainer}>
					<h2 style={{ marginTop: 0, marginBottom: 10 }}>
						¡Buen trabajo!💪🏼
					</h2>
					<p style={{ margin: 0 }}>
						¡Has estudiado {dataSource.length} palabras!
					</p>
					<Button
						/* style={Styles.startOverButton}  */
						style={{
							width: "60%",
							border: "none",
							borderRadius: "5px",
							fontWeight: "bold",
							fontSize: "1.4em",
							marginTop: 30,
						}}
						height={isMobile ? "75%" : "50%"}
						onClick={handleStartOver}
						variant="primary"
					>
						Empezar de nuevo
					</Button>
					<Button
						/* 						style={Styles.startOverButton}
						 */
						style={{
							width: "60%",
							border: "none",
							borderRadius: "5px",
							fontWeight: "bold",
							fontSize: "1.4em",
							marginTop: 30,
						}}
						onClick={onFinish}
						variant="success"
						height={isMobile ? "75%" : "50%"}
					>
						Finalizar y volver a configurar un repaso
					</Button>

					<button
						type="button"
						/* style={Styles.startOverButton} */
						style={{
							width: "60%",
							border: "none",
							borderRadius: "5px",
							fontWeight: "bold",
							fontSize: "1.4em",
							marginTop: 30,
						}}
						variant="outline-primary"
						onClick={onFinishVerPalabras}
						height={isMobile ? "75%" : "50%"}
					>
						FINALIZAR Y VER PALABRAS
					</button>
					<p />
				</div>
			) : (
				<div>
					<div style={Styles.progress}>
						<div style={Styles.bar}>
							<span
								style={{
									...Styles.complete,
									width: `${
										(step / dataSource.length) * 100
									}%`,
								}}
							></span>
						</div>
						<div style={Styles.number}>
							{`${step}/${dataSource?.length}`}
						</div>
					</div>
					<div style={Styles.card}>
						<img
							alt="description"
							style={Styles.soundButton}
							src={sonidoLogo} //"https://www.flaticon.com/svg/static/icons/svg/786/786272.svg"
							onClick={handleSpeaker}
						/>
						<div
							onClick={handleChangeSide}
							style={{ height: "100%" }}
						>
							<ReactCardFlip
								containerStyle={{ height: "100%" }}
								isFlipped={side === "back"}
								flipDirection={flipDirection}
							>
								<div style={Styles.cardContent}>
									{dataSource[step - 1]?.front?.image && (
										<img
											alt="description"
											width="120px"
											height="120px"
											style={{ borderRadius: "25px" }}
											src={
												dataSource[step - 1]?.front
													?.image
											}
										/>
									)}
									<p>{dataSource[step - 1]?.front?.text}</p>
								</div>
								<div style={Styles.cardContent}>
									{dataSource[step - 1]?.back?.image && (
										<img
											alt="description"
											width="120px"
											height="120px"
											style={{ borderRadius: "25px" }}
											src={
												dataSource[step - 1]?.back
													?.image
											}
										/>
									)}
									<p>{dataSource[step - 1]?.back?.text}</p>
								</div>
							</ReactCardFlip>
						</div>
					</div>
					<div style={Styles.navigation}>
						<div style={Styles.prevButton} onClick={handlePrev}>
							<img
								alt="description"
								width="100%"
								height="100%"
								src={flechaIzquierdaLogo} //"https://www.flaticon.com/svg/static/icons/svg/318/318276.svg"
							/>
						</div>
						<div style={Styles.nextButton} onClick={handleNext}>
							<img
								alt="description"
								width="100%"
								height="100%"
								src={flechaDerechaLogo} //"https://www.flaticon.com/svg/static/icons/svg/467/467152.svg"
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

FlashcardComponent.propTypes = {
	dataSource: PropTypes.array.isRequired,
	flipDirection: PropTypes.string,
	onChange: PropTypes.func,
	onSound: PropTypes.func,
	onFinish: PropTypes.func,
};

FlashcardComponent.defaultProps = {
	flipDirection: "horizontal",
	onChange: (step, size) => {},
	onSound: (text) => {},
	onFinish: () => {},
};

const Styles = {
	container: {
		backgroundColor: "#f6f7fb",
	},
	progress: {
		backgroundColor: "#ffffff",
		height: 45,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		paddingLeft: 16,
		paddingRight: 16,
	},
	bar: {
		marginLeft: "2rem",
		display: "flex",
		flex: 13,
		backgroundColor: "#c5cfe8",
		height: "0.75rem",
		position: "relative",
	},
	complete: {
		backgroundColor: "#4257b2",
		bottom: 0,
		display: "block",
		height: "0.75rem",
		left: 0,
		maxWidth: "100%",
		position: "absolute",
		top: 0,
		transition: "all .12s cubic-bezier(.47,0,.745,.715)",
	},
	number: {
		display: "flex",
		flex: 1,
		justifyContent: "flex-end",
		fontSize: "0.625rem",
		letterSpacing: "0.0625rem",
		fontWeight: 600,
	},
	card: {
		height: 400,
		padding: 16,
		position: "relative",
	},
	cardContent: {
		backgroundColor: "#ffffff",
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
		fontSize: "1.5rem",
	},
	soundButton: {
		position: "absolute",
		zIndex: 999,
		width: 25,
		height: 25,
		right: 26,
		top: 26,
		cursor: "pointer",
	},
	navigation: {
		display: "flex",
		justifyContent: "space-between",
		paddingBottom: 16,
	},
	prevButton: {
		width: 30,
		height: 30,
		marginLeft: 16,
		backgroundColor: "#ffffff",
		borderRadius: "50%",
	},
	nextButton: {
		width: 30,
		height: 30,
		marginRight: 16,
		backgroundColor: "#ffffff",
		borderRadius: "50%",
	},
	finishContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		minHeight: "300px",
	},
	startOverButton: {
		backgroundColor: "#4257b2",
		width: "60%",
		height: "50px",
		border: "none",
		borderRadius: "5px",
		color: "#ffffff",
		fontWeight: "bold",
		fontSize: "16px",
		marginTop: 30,
	},
};
