import React, { useEffect, useState } from "react";
//import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
	getPalabras,
	actualizarPalabrasARepasar,
	palabrasARepasar,
} from "../redux/actions/palabrasActions";
import { FlashcardComponent } from "../components/Flash-Cards/FlashCard";
import {
	PALABRAS_REPASAR_RESET,
	PALABRAS_DETAILS_RESET,
	PALABRAS_UPDATE_REPASAR_RESET,
} from "../redux/constants/palabrasConstants";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
import imagenIngles from "../data/imagenesIdioma/ingles.png";
import imagenEspañol from "../data/imagenesIdioma/Español.png";
import imagenHolandés from "../data/imagenesIdioma/Holandés.png";
import imagenPortugues from "../data/imagenesIdioma/Portugues.png";
import imagenItaliano from "../data/imagenesIdioma/Italiano.png";
import imagenAlemán from "../data/imagenesIdioma/Alemán.png";
import imagenFrancés from "../data/imagenesIdioma/Francés.png";
import imagenRuso from "../data/imagenesIdioma/Ruso.png";
import exclamation from "../data/imagenesIdioma/exclamation.png";

function RepasarScreen({ history, match }) {
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const palabrasRepasar = useSelector((state) => state.palabrasARepasar);
	const { loading, success: successPalabras, palabras } = palabrasRepasar;

	const actualizarPalabrasRepasadas = useSelector(
		(state) => state.actualizarPalabrasARepasar
	);
	const { success: successUpdate, loading: loadingUpdate } =
		actualizarPalabrasRepasadas;

	const [ver, setVer] = useState(true);

	const dispatch = useDispatch();

	var imageFront;
	var imageBack;

	const idiomaId = match.params.idioma;
	const cantidad = match.params.cantidad;
	const orden = match.params.orden;
	const modo = match.params.modo;

	const booleanIdiomaID =
		isNaN(parseInt(idiomaId)) || Math.sign(parseInt(idiomaId)) === -1;
	const booleancantidad =
		isNaN(parseInt(cantidad)) || Math.sign(parseInt(cantidad)) === -1;
	const booleanOrden =
		(orden.includes("viejas") || orden.includes("nuevas")) &&
		orden.length === 6;
	const booleanModo =
		(modo.includes("nativo") && modo.length === 6) ||
		(modo.includes("objetivo") && modo.length === 8);
	const esInvalido =
		booleanIdiomaID || booleancantidad || !booleanOrden || !booleanModo;

	useEffect(() => {
		if (!userInfo) {
			history.push("/login?redirect=/");
		} else if (esInvalido) {
			history.push("/configuracionRepasar");
		} else {
			if (!successUpdate) {
				dispatch({ type: PALABRAS_DETAILS_RESET });
				dispatch(palabrasARepasar(idiomaId, cantidad, orden));
			} else if (successUpdate) {
				dispatch({ type: PALABRAS_UPDATE_REPASAR_RESET });
				dispatch({ type: PALABRAS_REPASAR_RESET });
				dispatch(getPalabras());
			}
		}
	}, [
		dispatch,
		history,
		userInfo,
		esInvalido,
		idiomaId,
		cantidad,
		orden,
		successUpdate,
	]);

	var idiomasImagen = {
		Español: imagenEspañol,
		Holandés: imagenHolandés,
		Portugues: imagenPortugues,
		Italiano: imagenItaliano,
		Alemán: imagenAlemán,
		Francés: imagenFrancés,
		Inglés: imagenIngles,
		Ruso: imagenRuso,
	};

	if (modo === "nativo" && palabras.length > 0) {
		imageFront = idiomasImagen[userInfo.idioma]
			? idiomasImagen[userInfo.idioma]
			: exclamation;
		imageBack = idiomasImagen[palabras[0].idioma_objeto.name]
			? idiomasImagen[palabras[0].idioma_objeto.name]
			: exclamation;
	} else if (modo === "objetivo" && palabras.length > 0) {
		imageBack = idiomasImagen[userInfo.idioma]
			? idiomasImagen[userInfo.idioma]
			: exclamation;
		imageFront = idiomasImagen[palabras[0].idioma_objeto.name]
			? idiomasImagen[palabras[0].idioma_objeto.name]
			: exclamation;
	}

	const dictIdiomasParaElSpeak = {
		Inglés: "en-US",
		Español: "es",
		Ruso: "ru-RU",
		Francés: "fr-FR",
		Alemán: "de-DE",
		Checo: "cs-CZ",
		Italiano: "it-IT",
		Holandés: "nl-NL",
		Portugués: "pt-PT",
		Sueco: "sv-SE",
	};

	const pasarIdiomaSpeak = (e) => {
		if (palabras.length > 0) {
			if (palabras[0].idioma_objeto.name in dictIdiomasParaElSpeak) {
				return dictIdiomasParaElSpeak[palabras[0].idioma_objeto.name];
			} else {
				return "en-US";
			}
		} else {
			return "en-US";
		}
	};

	const pasarIdiomaNativoSpeak = (e) => {
		if (palabras.length > 0) {
			if (userInfo.idioma in dictIdiomasParaElSpeak) {
				return dictIdiomasParaElSpeak[userInfo.idioma];
			} else {
				return "en-US";
			}
		} else {
			return "en-US";
		}
	};

	const actualizarPalabrasConfigurarRepaso = (e) => {
		e.preventDefault();
		setVer(false);
		const idIdiomas = palabras.map((p) => ({
			id: p.id,
		}));
		dispatch(actualizarPalabrasARepasar(idIdiomas));

		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: "btn btn-info",
			},
			buttonsStyling: false,
		});

		swalWithBootstrapButtons.fire(
			"¡Buen trabajo!💪🏼",
			"Continua así y pronto no tendrás más palabras para estudiar.",
			"success"
		);
		setTimeout(() => {
			history.push("/configuracionRepasar");
		}, 1000);
	};

	const actualizarPalabrasVerPalabras = (e) => {
		setVer(false);
		e.preventDefault();
		const idIdiomas = palabras.map((p) => ({
			id: p.id,
		}));
		dispatch(actualizarPalabrasARepasar(idIdiomas));

		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: "btn btn-info",
			},
			buttonsStyling: false,
		});

		swalWithBootstrapButtons.fire(
			"¡Buen trabajo!💪🏼",
			"Continua así y pronto no tendrás más palabras para estudiar.",
			"success"
		);
		setTimeout(() => {
			history.push("/verPalabras");
		}, 1500);
	};

	const dataSoure =
		palabras && modo === "nativo"
			? palabras.map((p) => ({
					front: {
						text: p.traduccion,
						image: imageFront,
					},
					back: {
						text: p.palabra,
						image: imageBack,
					},
			  }))
			: palabras && modo === "objetivo"
			? palabras.map((p) => ({
					front: {
						text: p.palabra,
						image: imageFront,
					},
					back: {
						text: p.traduccion,
						image: imageBack,
					},
			  }))
			: [];

	const PromptNoHayPalabras = () => {
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: "btn btn-info",
			},
			buttonsStyling: false,
		});

		swalWithBootstrapButtons
			.fire({
				icon: "warning",
				title: "Oops...",
				text: "Parece que no tienes traducciones para estas palabra!",
				confirmButtonText: `Volver`,
			})
			.then((result) => {
				if (result.isConfirmed) {
					history.push("/configuracionRepasar/");
				} else {
					history.push("/configuracionRepasar/");
				}
			});
	};

	return (
		<div>
			{userInfo && (
				<div>
					<h1>Repasando con Flashcards</h1>
					{loading ? (
						<Loader />
					) : (
						<div>
							{palabras.length > 0 &&
							successPalabras === true &&
							ver ? (
								<FlashcardComponent
									dataSource={dataSoure}
									codigoIdioma={pasarIdiomaSpeak()}
									codigoIdiomaNativo={pasarIdiomaNativoSpeak()}
									onFinish={
										actualizarPalabrasConfigurarRepaso
									}
									onFinishVerPalabras={
										actualizarPalabrasVerPalabras
									}
									modo={modo}
								/>
							) : palabras.length === 0 &&
							  successPalabras === false &&
							  ver ? (
								PromptNoHayPalabras()
							) : null}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default RepasarScreen;
