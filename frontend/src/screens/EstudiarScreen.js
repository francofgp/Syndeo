import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
	Container,
	ButtonToolbar,
	ButtonGroup,
	Button,
	Label,
	Col,
	Row,
	Card,
	Form,
	Toast,
	Tooltip,
	OverlayTrigger,
	Image,
} from "react-bootstrap";
import { getIdiomas } from "../redux/actions/IdiomasActions";
import { setFechaUltimaLectura, getTextoDetails, marcarComoLeido, checkTexto } from "../redux/actions/textosActions";
import {
	traduccionPalabra,
	actualizarDificultadPalabra,
	actualizarDificultadFrase,
} from "../redux/actions/palabrasActions";
import { PALABRA_TRADUCCION_RESET } from "../redux/constants/palabrasConstants";
import { TEXTO_DETAILS_RESET } from "../redux/constants/textosConstans";
import { TEXTO_CHECK_RESET } from "../redux/constants/textosConstans";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
import { Scrollbars } from "rc-scrollbars";
import { isMobile, isMobileOnly } from "react-device-detect";
import Tour from "reactour";
import imagenTraduccion from "../data/imagenesEstudiar/translate.png";
import imagenCompletarLectura from "../data/imagenesEstudiar/accept.png";
import imagenCompletarLecturaMobile from "../data/imagenesEstudiar/acceptMobile.png";
import imagenEnviar from "../data/imagenesEstudiar/imagenEnviarColorBlanco.svg";
import imagenMarcarComoLeido from "../data/imagenesEstudiar/imangeMarcarComoLeido.gif";

function EstudiarScreen({ history, match }) {
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const idiomas = useSelector((state) => state.idiomas);
	const { idiomasTotal } = idiomas;

	const textoRedux = useSelector((state) => state.textoInfo);
	const { textoInfo, loading: loadingTexto, success: successTexto, error } = textoRedux;

	const marcarComoLeidoRedux = useSelector((state) => state.marcarComoLeido);
	const {
		loading: loadingMarcarComoLeido,
		success: successMarcarComoLeido,
		data: dataMarcarComoLeido,
	} = marcarComoLeidoRedux;

	const palabraTraducion = useSelector((state) => state.palabraTraduccion);
	const { traduccion, success: successTraduccion } = palabraTraducion;

	const checkTextoRedux = useSelector((state) => state.checkTexto);
	const { data: dataCheckTexto, success: successCheckTexto } = checkTextoRedux;

	const [texto, setTexto] = useState({});
	const [dificultad, setDificultad] = useState("");
	const [palabraTraducida, setTraduccion] = useState("");
	const [palabraSeleccionada, setPalabraSeleccionada] = useState("");
	const [fraseATraducir, setFraseATraducir] = useState("");
	const [seTradujoFrase, setSeTradujoFrase] = useState("");
	const [fraseNotificacion, setFraseNotificacion] = useState("");
	const [palabraSeleccionadaMultiple, setPalabraSeleccionadaMultiple] = useState("");
	const [palabraSeleccionadaMultipleCompleta, setPalabraSeleccionadaMultipleCompleta] = useState("");
	const [palabraMouse, setPalabraMouse] = useState("");
	const [youtube, setYoutube] = useState("");
	const [audio, setAudio] = useState("");
	const [activadoSeleccionDeTexto, setActivadoSeleccionDeTexto] = useState(false);
	const [indice, setIndice] = useState("");
	const [estaLeido, setEstaLeido] = useState("");
	const [show, setShow] = useState(false);
	const [check, setCheck] = useState(true);
	const [traduccionesDelTexto, setTradducionesDelTexto] = useState({});

	const [tour, setTour] = useState(false);

	const textoID = match.params.id;

	const dispatch = useDispatch();

	//-------------------------------------------------------

	useEffect(() => {
		if (successTraduccion) {
			setTraduccion(traduccion.translations[0].translation);
		}
	}, [successTraduccion, traduccion]);

	useEffect(() => {
		if (successMarcarComoLeido) {
			setTexto(dataMarcarComoLeido);
		}
	}, [dataMarcarComoLeido, successMarcarComoLeido]);

	useEffect(() => {
		if (error) {
			dispatch({ type: TEXTO_DETAILS_RESET });
			history.push("/notfound");
		}
	}, [dispatch, error, history]);

	useEffect(() => {
		if (successTexto) {
			if (userInfo.id === textoInfo.usuario) {
				setTexto(textoInfo);
				setAudio(textoInfo.audio);
				setYoutube(textoInfo.youtube);
				handlerGetTexto();
				setEstaLeido(textoInfo.completado);
				cargar();
				setTraduccion("");
			} else {
				history.push("/notfound");
			}
		}
	}, [dispatch, successTexto, textoID, textoInfo, texto]);

	useEffect(() => {
		if (!userInfo) {
			history.push("/login?redirect=/verTextos");
		} else {
			if (Number(textoID)) {
				dispatch({ type: TEXTO_DETAILS_RESET });
				dispatch(getTextoDetails(textoID));
			} else {
				history.push("/verTextos");
			}
		}

		/* return () => {
			dispatch({ type: TEXTO_DETAILS_RESET });
		}; */
	}, [dispatch, history, userInfo]);

	//-------------------------------------------------------

	function cargar() {
		var textoRenderizado = "";
		texto
			? texto.palabras
				? texto.palabras.forEach(function (palabra /* , indice, array */) {
						var salto = "";
						if (palabra["salto"]) {
							salto = "<br>";
						}
						if (palabra["dificultad"] === 0) {
							textoRenderizado =
								textoRenderizado +
								`<span style="color:blue">${palabra["palabraOriginal"]}${salto}</span>` +
								" ";
						} else if (palabra["dificultad"] === 1) {
							textoRenderizado =
								textoRenderizado +
								`<span style="color:green">${palabra["palabraOriginal"]}${salto}</span>` +
								" ";
						} else if (palabra["dificultad"] === 2) {
							textoRenderizado =
								textoRenderizado +
								`<span style="color:orange">${palabra["palabraOriginal"]}${salto}</span>` +
								" ";
						} else if (palabra["dificultad"] === 3) {
							textoRenderizado =
								textoRenderizado +
								`<span style="color:red">${palabra["palabraOriginal"]}${salto}</span>` +
								" ";
						} else if (palabra["dificultad"] === 4) {
							textoRenderizado =
								textoRenderizado +
								`<span style="color:black">${palabra["palabraOriginal"]}${salto}</span>` +
								" ";
						} else if (palabra["dificultad"] === 5) {
							textoRenderizado =
								textoRenderizado +
								`<span style="color:black">${palabra["palabraOriginal"]}${salto}</span>` +
								" ";
						}
				  })
				: console.log("cargando")
			: console.log("cargando");
		document.getElementById("sel2").innerHTML = textoRenderizado;
	}

	const handlerDificultad = (nivelDeDificultad) => {
		const traduccionAEnviar = palabraTraducida;
		var clave2 = palabraSeleccionada
			.toLowerCase()
			.replace(/[!¡?¿!"#$%&/()«»;=#,+()$~%.":*?<>{}]/g, "")
			.replace("[", "")
			.replace("]", "")
			.trim();

		for (var clave in texto.palabras) {
			if (texto.palabras[clave]["palabra"] === clave2) {
				texto.palabras[clave]["dificultad"] = nivelDeDificultad;
				//guardarPalabra(texto.palabras[clave]["id"], nivelDeDificultad);
				var id = texto.palabras[clave]["id"];
			}
		}

		if (!palabraSeleccionada) {
			id = 0;
		}

		if (palabraSeleccionada) {
			if (id) {
				dispatch(actualizarDificultadPalabra(id, nivelDeDificultad, traduccionAEnviar, ""));
				cargar();

				var frase = `${palabraSeleccionada} - ${traduccionAEnviar} Guardada`;
				//frase = `${palabraSeleccionada} - dificultad actualizada`;

				if (dificultad === 5) {
					frase = "Ignorada";
				}
				setFraseNotificacion(frase);
				setShow(true);
				setTraduccion("");
			} else if (palabraSeleccionada) {
				dispatch(
					actualizarDificultadFrase(
						nivelDeDificultad,
						traduccionAEnviar,
						palabraSeleccionada,
						texto.id,
						texto.idioma
					)
				);

				var frase = `${palabraSeleccionada} - ${traduccionAEnviar} Guardada`;
				//frase = `${palabraSeleccionada} - dificultad actualizada`;

				if (dificultad === 5) {
					frase = "Ignorada";
				}
				setFraseNotificacion(frase);
				setShow(true);
				setTraduccion("");
			}
		}
		if (seTradujoFrase || palabraSeleccionadaMultipleCompleta.split(" ").length > 1) {
			dispatch(
				actualizarDificultadFrase(
					nivelDeDificultad,
					traduccionAEnviar,
					fraseATraducir ? fraseATraducir : palabraSeleccionadaMultipleCompleta,
					texto.id,
					texto.idioma
				)
			);

			var frase = `${
				palabraSeleccionadaMultipleCompleta.length !== 0 ? palabraSeleccionadaMultipleCompleta : fraseATraducir
			} - (${traduccionAEnviar}) guardada`;
			//frase = `${palabraSeleccionadaMultiple} - dificultad actualizada`;

			setFraseNotificacion(frase);
			setShow(true);
			setSeTradujoFrase(false);
			setTraduccion("");
		}

		const ToastGuardado = Swal.mixin({
			toast: true,
			position: "top-end",
			showConfirmButton: false,
			timer: 1200,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.addEventListener("mouseenter", Swal.stopTimer);
				toast.addEventListener("mouseleave", Swal.resumeTimer);
			},
		});

		ToastGuardado.fire({
			icon: "success",
			title: frase,
		});
	};

	function getPalabra(e) {
		//e.preventDefault();
		if (!e.target.innerHTML.includes("</span>")) {
			setTraduccion("");
			setPalabraSeleccionada(e.target.innerHTML.replace("<br>", ""));
			setPalabraSeleccionadaMultipleCompleta("");
			buscarTraduccion(
				e.target.innerHTML
					.toLowerCase()
					.replace(/[!¡?¿!"#$%&/()«»;=#,+()$~%.":*?<>{}]/g, "")
					.replace("[", "")
					.replace("]", "")
					.trim()
					.replace("<br>", "")
			);
		}
	}

	function getBuscarTraduccion(e) {
		e.preventDefault();
		if (!e.target.innerHTML.includes("</span>")) {
			var palabraParaObtenerTraduccion = e.target.innerHTML.replace("<br>", "");

			//console.log(`Palabra seleccionada multiple:${palabraSeleccionadaMultipleCompleta}`);
			var palabraLimpia =
				palabraSeleccionadaMultipleCompleta === ""
					? palabraParaObtenerTraduccion
							.toLowerCase()
							.replace(/[!¡?¿!"#$%&/()«»;=#,+()$~%.":*?<>{}]/g, "")
							.replace("[", "")
							.replace("]", "")
							.trim()
					: palabraSeleccionadaMultipleCompleta
							.toLowerCase()
							.replace(/[!¡?¿!"#$%&/()«»;=#,+()$~%.":*?<>{}]/g, "")
							.replace("[", "")
							.replace("]", "")
							.trim();
			//console.log(`Palabra limpia:${palabraLimpia}`);
			if (palabraSeleccionadaMultipleCompleta) {
				buscarTraduccion(palabraLimpia);
			}

			/* for (var clave in texto.palabras) {
				if (texto.palabras[clave]["palabra"] === palabraLimpia) {
					console.log(palabraLimpia);
					console.log(texto.palabras[clave]["traduccion"]);
					break;
				}
			} */
		}
	}

	async function buscarTraduccion(palabra) {
		//console.log("palabra", palabra);
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.get(`/api/palabras/obtener/traduccion/?palabra=${palabra}`, config);

		setTraduccion(data.traduccion ? data.traduccion : "");
		//dispatch(getTextoDetails(textoID));

		return data;
	}

	/* 	async function actualizarTraducciones() {
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.get(
			`/api/textos/mejorado/${textoID}/`,
			config
		);
		setTradducionesDelTexto(data);
		return data;
	}

	const getTraduccion = (index) => {
		if (traduccionesDelTexto && traduccionesDelTexto.palabras) {
			return traduccionesDelTexto.palabras[index].traduccion;
		}
		return "";
	}; */

	const redirigirAModificarTexto = () => {
		history.push(`/modificarTexto/${texto.id}`);
	};

	document.onmouseup =
		document.onkeyup =
		document.onselectionchange =
			function () {
				getSelectionText();
			};

	function getSelectionText() {
		//setPalabraSeleccionadaMultipleCompleta("");
		var text = "";
		var fraseSeleccionadaTemporal = "";

		try {
			if (window.getSelection() !== null) {
				if (window.getSelection().anchorNode !== null) {
					if (window.getSelection().anchorNode.parentElement.parentElement.id) {
						if (window.getSelection().anchorNode.parentElement.parentElement.id === "sel2") {
							text = window.getSelection().toString();
						}
					}
				}
			}

			text = text
				.toLowerCase()
				.replace(/[!¡?¿!"#$%&/()«»;=#,+()$~%.":*?<>{}]/g, "")
				.replace("[", "")
				.replace("]", "")
				.trim();

			setPalabraSeleccionadaMultiple("");

			if (text !== "") {
				setActivadoSeleccionDeTexto(true);
			} else {
				setActivadoSeleccionDeTexto(false);
			}
			if (window.getSelection() !== null) {
				if (
					window.getSelection().toString().length > 1 &&
					window.getSelection().anchorNode.parentElement.parentElement.id === "sel2"
				) {
					//if (window.getSelection().anchorNode.parentElement.parentElement.id === "sel2") {
					fraseSeleccionadaTemporal = window.getSelection().toString().replace(/[\n]/g, " ").split(" ");
					fraseSeleccionadaTemporal = fraseSeleccionadaTemporal.filter(function (str) {
						return /\S/.test(str);
					});
					var valor = getSelectionDir(window.getSelection());
					//}
					if (window.getSelection().focusNode.data === " " && window.getSelection().anchorNode.data !== " ") {
						if (valor === -1) {
							fraseSeleccionadaTemporal[fraseSeleccionadaTemporal.length - 1] =
								window.getSelection().anchorNode.data;
						} else if (valor === 1) {
							fraseSeleccionadaTemporal[0] = window.getSelection().anchorNode.data;
						}
					}
					if (window.getSelection().anchorNode.data === " " && window.getSelection().focusNode.data !== " ") {
						if (valor === -1) {
							fraseSeleccionadaTemporal[0] = window.getSelection().focusNode.data;
						} else if (valor === 1) {
							fraseSeleccionadaTemporal[fraseSeleccionadaTemporal.length - 1] =
								window.getSelection().focusNode.data;
						}
					}
					if (window.getSelection().focusNode.data === " " && window.getSelection().anchorNode.data === " ") {
						fraseSeleccionadaTemporal = window
							.getSelection()
							.toString()
							.split(" ")
							.filter(function (str) {
								return /\S/.test(str);
							});
					}

					if (window.getSelection().focusNode.data !== " " && window.getSelection().anchorNode.data !== " ") {
						if (valor === -1) {
							fraseSeleccionadaTemporal[0] = window.getSelection().focusNode.data;
							fraseSeleccionadaTemporal[fraseSeleccionadaTemporal.length - 1] =
								window.getSelection().anchorNode.data;
						} else if (valor === 1) {
							fraseSeleccionadaTemporal[0] = window.getSelection().anchorNode.data;
							fraseSeleccionadaTemporal[fraseSeleccionadaTemporal.length - 1] =
								window.getSelection().focusNode.data;
						}
					}

					fraseSeleccionadaTemporal = fraseSeleccionadaTemporal
						.join(" ")
						.replace(/[!¡?¿!"#$%&/()«»;=#+()$~%.":*?<>{}]/g, "")
						.replace("[", "")
						.replace("]", "")
						.toLowerCase()
						.trim();
					setActivadoSeleccionDeTexto(true);
					//console.log(fraseSeleccionadaTemporal)
					setPalabraSeleccionadaMultipleCompleta(fraseSeleccionadaTemporal);
					setPalabraSeleccionada("");
				}
			}
			setPalabraSeleccionadaMultiple(text);
		} catch (logerror) {
			console.log("excepcion exitosa");
		}
	}

	function getSelectionDir(sel) {
		var range = document.createRange();
		range.setStart(sel.anchorNode, sel.anchorOffset);
		range.setEnd(sel.focusNode, sel.focusOffset);
		if (
			range.startContainer !== sel.anchorNode ||
			(sel.anchorNode === sel.focusNode && sel.focusOffset < sel.anchorOffset)
		)
			return -1;
		else return 1;
	}

	const handlerGetTexto = () => {
		function youtube_parser(url) {
			var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
			var match = url.match(regExp);
			return match && match[7].length === 11 ? match[7] : false;
		}
		var ytCode = youtube_parser(textoInfo.youtubeURL);
		var ytLink = `https://www.youtube.com/embed/${ytCode}?autoplay=`;

		if (ytCode) {
			setYoutube(ytLink);
		}
	};

	const handlerMarcorComoLeido = (e) => {
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: "btn btn-success",
				cancelButton: "btn btn-primary",
			},
			buttonsStyling: false,
		});
		swalWithBootstrapButtons
			.fire({
				imageUrl: imagenMarcarComoLeido,
				imageHeight: 100,
				imageAlt: "Fallo al cargar la imagen",
				title: "¿Quieres marcar este texto como leído?",
				text: "Esta acción es irreversible.",
				//icon: "question",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonText: "Cancelar",
				cancelButtonColor: "#d33",
				confirmButtonText: "Sí!",
			})
			.then((result) => {
				if (result.value) {
					setEstaLeido(true);
					for (let i = 0; i < texto.palabras.length; i++) {
						if (texto.palabras[i]["dificultad"] === 0) {
							texto.palabras[i]["dificultad"] = 4;
						}
					}
					cargar();
					e.preventDefault();
					dispatch(marcarComoLeido(texto.id));

					swalWithBootstrapButtons.fire("Leído!", "Haz marcado este texto como leído.", "success");
				}
			});
	};

	const handlerTraduccion = () => {
		if (palabraSeleccionadaMultipleCompleta !== "") {
			setFraseATraducir(palabraSeleccionadaMultipleCompleta);
			setSeTradujoFrase(true);
			dispatch(
				traduccionPalabra(
					texto.idioma_objeto.name,
					palabraSeleccionadaMultipleCompleta
						.toLowerCase()
						.replace(/[!¡?¿!"#$%&/();=#,+()$~%.":*?<>{}]/g, "")
						.trim()
				)
			);
		} else if (palabraSeleccionada !== "") {
			setSeTradujoFrase(false);
			dispatch(traduccionPalabra(texto.idioma_objeto.name, palabraSeleccionada.replace(/[\n]/g, ". ")));
		}
	};

	const getColorDificultad = (dificultad) => {
		if (dificultad == 0) {
			return "blue";
		}
		if (dificultad == 1) {
			return "green";
		}
		if (dificultad == 2) {
			return "orange";
		}
		if (dificultad == 3) {
			return "red";
		}
		if (dificultad == 4) {
			return "black";
		}

		return "black";
	};

	const tourConfig = [
		{
			selector: '[data-tut="titulo"]',
			content: () => (
				<div className="text-justify">
					<h3 className="text-center">¿Necesitas ayuda?</h3>
					Ok. Este es el texto que acabas de abrir.
				</div>
			),
			stepInteraction: false,
		},
		{
			selector: '[data-tut="contenido"]',
			content: () => (
				<div className="text-justify">
					<h4 className="text-center">Lectura:</h4>
					<br></br>
					Las palabras que nunca has visto se indicarán de color{" "}
					<span style={{ fontWeight: 900, color: "blue" }}> azul</span>.<br></br>
					Si no entiendes porqué dijimos esto, no te preocupes, sigue adelante.
				</div>
			),
			stepInteraction: false,
		},
		{
			selector: '[data-tut="contenido-interno"]',
			content: () => (
				<div className="text-justify">
					¿No entiendes una palabra?
					<p style={{ fontWeight: "900" }}>Adelante, seleccionala.</p>
				</div>
			),

			//position: "center", /* Podes poner top,right,left, si no hay espacio, se acomoda solo */
		},

		{
			selector: '[data-tut="boton-traducir"]',
			content: () => (
				<div className="text-justify">
					{" "}
					Presioná el botón para <strong style={{ fontWeight: 900 }}>traducirla.</strong>
					<p style={{ fontWeight: "900" }}>Adelante, hazlo.</p>
				</div>
			),
		},
		{
			selector: '[data-tut="resultado-traducir"]',
			content: () => (
				<div className="text-justify">
					{" "}
					Aquí aparecerán las traducciones que brinda Syndeo. <br></br>
					Siéntete libre de modificarlas a tu gusto cuando quieras.
				</div>
			),
			stepInteraction: false,
		},
		{
			selector: '[data-tut="seleccion-dificultad"]',
			content: () => (
				<div className="text-justify">
					¿Quieres agregar la palabra a tu vocabulario? Presiona uno de los botones para asignarle una
					dificultad:
					<ul>
						<li
							style={{
								color: "green",
								fontWeight: 900,
							}}
						>
							<b>Fácil</b>
						</li>
						<li
							style={{
								color: "orange",
								fontWeight: 900,
							}}
						>
							Media
						</li>
						<li
							style={{
								color: "tomato",
								fontWeight: 900,
							}}
						>
							Difícil
						</li>
					</ul>
				</div>
			),
		},
		{
			selector: '[data-tut="contenido"]',
			content: () => (
				<div className="text-justify">
					{" "}
					¿Has notado como la palabra cambió de{" "}
					<span
						className="cambiar-color-random"
						style={{
							fontWeight: 900,
						}}
					>
						color
					</span>
					?<br></br>
					Esto sucederá para todas tus palabras dependiendo de su dificultad.
				</div>
			),
			stepInteraction: false,
		},
		{
			selector: '[data-tut="ignorar"]',
			content: () => (
				<div className="text-justify">
					{" "}
					Si no te interesa aprender una palabra siempre puedes{" "}
					<span
						style={{
							fontWeight: 900,
						}}
					>
						ignorarla.
					</span>
					<br></br>
					Entonces esta palabra no se tendrá en cuenta a la hora de registrar tu progreso.
				</div>
			),
			stepInteraction: false,
		},
		{
			selector: '[data-tut="lectura-completada"]',
			content: () => (
				<div className="text-justify">
					<h3 className="text-center">
						Completar lectura <i className="fas fa-book"></i>:
					</h3>
					Cuando termines de leer tu texto, podrás marcarlo como leído.
					<br></br>
					Al hacer esto las palabras que no hayas marcado, se marcaran como{" "}
					<span
						style={{
							fontWeight: 900,
						}}
					>
						Aprendidas
					</span>{" "}
					y serán agregadas a tu vocabulario
				</div>
			),
			stepInteraction: false,
		},
		{
			selector: '[data-tut="aprendida"]',
			content: () => (
				<div className="text-justify">
					Aunque claro, siempre puedes marcar cada palabra individualmente si así lo deseas, como{" "}
					<span
						style={{
							fontWeight: 900,
						}}
					>
						Aprendidas
					</span>
					.
				</div>
			),
			stepInteraction: false,
		},
		{
			selector: '[data-tut="mensaje-final"]',
			content: () => (
				<div className="text-justify">
					Puedes ver este mensaje cuantas veces quieras. Y recuerda:
					<br></br>
					<br></br>
					<h4 className="text-center">
						Siempre disfruta de la lectura <i className="fas fa-book-open"></i>
					</h4>
				</div>
			),
			stepInteraction: false,
		},
	];

	const handlerGuardarTraduccion = () => {
		const traduccionAEnviar = palabraTraducida;
		var clave2 = palabraSeleccionada
			.toLowerCase()
			.replace(/[!¡?¿!"#$%&/()«»;=#,+()$~%.":*?<>{}]/g, "")
			.replace("[", "")
			.replace("]", "")
			.trim();
		for (var clave in texto.palabras) {
			if (texto.palabras[clave]["palabra"] === clave2) {
				//texto.palabras[clave]["dificultad"] = nivelDeDificultad;
				//guardarPalabra(texto.palabras[clave]["id"], nivelDeDificultad);
				var id = texto.palabras[clave]["id"];
			}
		}
		if (!palabraSeleccionada) {
			id = 0;
		}

		if (palabraSeleccionada) {
			if (id) {
				dispatch(actualizarDificultadPalabra(id, "", traduccionAEnviar, ""));
				cargar();

				var frase = `${palabraSeleccionada} - ${traduccionAEnviar} Guardada`;
				//frase = `${palabraSeleccionada} - dificultad actualizada`;

				if (dificultad === 5) {
					frase = "Ignorada";
				}
				setFraseNotificacion(frase);
				setShow(true);
				setTraduccion("");
			}
		}

		if (seTradujoFrase || palabraSeleccionadaMultipleCompleta.split(" ").length > 1) {
			dispatch(
				actualizarDificultadFrase(
					"",
					traduccionAEnviar,
					fraseATraducir ? fraseATraducir : palabraSeleccionadaMultipleCompleta,
					texto.id,
					texto.idioma
				)
			);

			var frase = `${
				palabraSeleccionadaMultipleCompleta.length !== 0 ? palabraSeleccionadaMultipleCompleta : fraseATraducir
			} - (${traduccionAEnviar}) guardada`;
			//frase = `${palabraSeleccionadaMultiple} - dificultad actualizada`;

			setFraseNotificacion(frase);
			setShow(true);
			setSeTradujoFrase(false);
			setTraduccion("");
		}

		const ToastGuardado = Swal.mixin({
			toast: true,
			position: "top-end",
			showConfirmButton: false,
			timer: 2500,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.addEventListener("mouseenter", Swal.stopTimer);
				toast.addEventListener("mouseleave", Swal.resumeTimer);
			},
		});

		ToastGuardado.fire({
			icon: "success",
			title: frase,
		});
	};

	const onSubmitTraduccion = (e) => {
		if (e.key === "Enter" && palabraTraducida !== "") {
			handlerGuardarTraduccion();
		}
	};

	const renderTooltip = (props) => (
		<Tooltip id="button-tooltip" {...props}>
			<p>Aquí aparecerán los significados que le hayas agregado a tus palabras</p>
		</Tooltip>
	);

	const renderContent = () => {
		if (isMobileOnly) {
			return (
				<div>
					{" "}
					{userInfo && idiomasTotal ? (
						textoInfo === undefined ? (
							<Loader />
						) : textoInfo ? (
							<Container fluid>
								<Row>
									<Col xs={8}>
										<h1 data-tut="titulo">{texto.nombre}</h1>
									</Col>

									{/* <Col>
										<Button
											className="float-right"
											bsstyle="danger"
											bssize="small"
											variant="secondary"
											onClick={redirigirAModificarTexto}
										>
											<i class="fas fa-edit"></i>
										</Button>
									</Col> */}

									<Col>
										<Button
											data-tut="mensaje-final"
											className="float-right"
											bsstyle="danger"
											bssize="small"
											variant="secondary"
											onClick={() => setTour(true)}
										>
											<i className="far fa-question-circle"></i>
										</Button>

										<Button
											data-tut="lectura-completada"
											className="float-right "
											size="sm"
											width="20px"
											variant="secondary"
											onClick={(e) => handlerMarcorComoLeido(e)}
											disabled={estaLeido}
										>
											<img
												alt="description"
												src={imagenCompletarLecturaMobile}
												style={{
													width: 30,
													height: 30,
													"border-radius": "3px",
													padding: "2% 2% 2% 2%",
												}}
											/>
										</Button>
									</Col>
								</Row>
								<Row className="mb-1">
									<Col>
										{loadingTexto ? (
											<Loader />
										) : (
											<div>
												<Scrollbars
													data-tut="contenido"
													className="text-justify"
													style={{
														//width: "30rem",
														height: "45vh",
													}}
													width={"auto"}
												>
													<p
														data-tut="contenido-interno"
														id="sel2"
														rows="5"
														cols="20"
														style={{
															padding: "7px",
															fontSize: "1.35em",
														}}
														onClick={(e) => getPalabra(e)}
														onMouseUp={(e) => getBuscarTraduccion(e)}
													>
														{/*}
														{texto &&
															texto.palabras &&
															texto.palabras.map(
																(
																	palabra,
																	index
																) => {
																	if (
																		palabra.salto
																	) {
																		return (
																			<span
																				style={{
																					color: `${getColorDificultad(
																						palabra.dificultad
																					)}`,
																				}}
																			>
																				{`${palabra.palabraOriginal} `}
																				<br></br>
																			</span>
																		);
																	}
																	return (
																		<span
																			style={{
																				color: `${getColorDificultad(
																					palabra.dificultad
																				)}`,
																			}}
																		>{`${palabra.palabraOriginal} `}</span>
																	);
																}
															)}*/}
													</p>
												</Scrollbars>
											</div>
										)}
									</Col>
								</Row>
								<Row className="mb-0">
									<Col xs={8} md={10}>
										<Form.Group data-tut="resultado-traducir" controlId="name">
											<Form.Control
												size="sm"
												type="text"
												style={{ width: "fill" }}
												placeholder="Aquí aparecerán las traducciones"
												value={palabraTraducida}
												onChange={(e) => {
													setTraduccion(e.target.value);
												}}
												onKeyDown={onSubmitTraduccion}
											></Form.Control>
										</Form.Group>

										{texto.idioma_objeto ? (
											texto.idioma_objeto.name === userInfo.idioma ? (
												<Form.Text className="text-muted">
													Función desabilitada, su idioma de perfil coincide con el idioma del
													texto.
												</Form.Text>
											) : null
										) : null}
									</Col>
									<Col xs={2} md={2} className="text-right">
										<ButtonGroup className="d-flex">
											<Button
												data-tut="boton-traducir"
												size="sm"
												variant="primary"
												onClick={handlerTraduccion}
												disabled={
													(texto.idioma_objeto
														? texto.idioma_objeto.name === userInfo.idioma
														: false) ||
													(!palabraSeleccionada && !palabraSeleccionadaMultipleCompleta)
												}
											>
												<img
													alt="description"
													src={imagenTraduccion}
													style={{
														width: 18,
														height: 18,
													}}
												/>
											</Button>

											<Button
												size="sm"
												variant="primary"
												onClick={handlerGuardarTraduccion}
												disabled={palabraTraducida === ""}
											>
												<Image
													alt="imagenEnviar"
													src={imagenEnviar}
													style={{
														width: 18,
														height: 18,
														//border: "2px outset"
														//top: "1px"
														//padding: "0% 2% 2% 2%",
														//backgroundColor: "white",
													}}
												/>
											</Button>
										</ButtonGroup>
									</Col>
								</Row>
								<Row className=" mt-1 ">
									<Col xs={12} className="text-center">
										<ButtonGroup className="mb-1" size="sm">
											<div>
												{/*
												<Button
													size="sm"
													onClick={(e) => {
														handlerDificultad(0);
														//updateDificultad(e, 0);
													}}
													disabled={
														seTradujoFrase ||
															palabraSeleccionadaMultipleCompleta ||
															palabraSeleccionadaMultiple ||
															palabraSeleccionada
															? false
															: true
													}
												>
													⠀
													<i class="fas fa-eye-slash">
														{"⠀"}
													</i>
												</Button>*/}
												<div
													data-tut="seleccion-dificultad"
													style={{
														display: "inline-block",
													}}
												>
													<OverlayTrigger
														key={1}
														delay={1000}
														overlay={
															<Tooltip id={1}>
																<strong
																	style={{
																		color: "green",
																	}}
																>
																	Fácil:{" "}
																</strong>
																¿Sientes que podrias estudiar un poco más esta palabra?
																Entonces márcala como{" "}
																<strong
																	style={{
																		color: "green",
																	}}
																>
																	Fácil!
																</strong>
															</Tooltip>
														}
													>
														<Button
															size="sm"
															onClick={(e) => {
																//updateDificultad(e, 1);
																handlerDificultad(1);
															}}
															disabled={
																seTradujoFrase ||
																palabraSeleccionadaMultipleCompleta ||
																palabraSeleccionadaMultiple ||
																palabraSeleccionada
																	? false
																	: true
															}
														>
															<span
																style={{
																	color: "green",
																}}
															>
																<i className="fas fa-circle">{"⠀"}</i>
															</span>
														</Button>
													</OverlayTrigger>
													<OverlayTrigger
														key={2}
														delay={1000}
														overlay={
															<Tooltip id={2}>
																<strong
																	style={{
																		color: "orange",
																	}}
																>
																	Media:{" "}
																</strong>
																Siempre te olvidas de esta palabra pero, ¿Sabes su
																significado? Entonces márcala como{" "}
																<strong
																	style={{
																		color: "orange",
																	}}
																>
																	Media!
																</strong>
															</Tooltip>
														}
													>
														<Button
															size="sm"
															onClick={(e) => {
																handlerDificultad(2);
																//updateDificultad(e, 2);
															}}
															disabled={
																seTradujoFrase ||
																palabraSeleccionadaMultipleCompleta ||
																palabraSeleccionadaMultiple ||
																palabraSeleccionada
																	? false
																	: true
															}
														>
															<span
																style={{
																	color: "orange",
																}}
															>
																<i className="fas fa-circle">{"⠀"}</i>
															</span>
														</Button>
													</OverlayTrigger>
													<OverlayTrigger
														key={3}
														delay={1000}
														overlay={
															<Tooltip id={3}>
																<strong
																	style={{
																		color: "tomato",
																	}}
																>
																	Difícil:{" "}
																</strong>
																Que el color no te asuste. ¿Es una palabra que la vez
																por primera vez? ¿Acaso es muy larga? Entonces márcala
																como{" "}
																<strong
																	style={{
																		color: "tomato",
																	}}
																>
																	Difícil!
																</strong>
															</Tooltip>
														}
													>
														<Button
															size="sm"
															onClick={(e) => {
																handlerDificultad(3);
																//updateDificultad(e, 3);
															}}
															disabled={
																seTradujoFrase ||
																palabraSeleccionadaMultipleCompleta ||
																palabraSeleccionadaMultiple ||
																palabraSeleccionada
																	? false
																	: true
															}
														>
															<span
																style={{
																	color: "tomato",
																}}
															>
																<i className="fas fa-circle">{"⠀"}</i>
															</span>
														</Button>
													</OverlayTrigger>
												</div>
												<div
													data-tut="aprendida"
													style={{
														display: "inline-block",
													}}
												>
													<Button
														size="sm"
														onClick={(e) => {
															handlerDificultad(4);
															//updateDificultad(e, 4);
														}}
														disabled={
															seTradujoFrase ||
															palabraSeleccionadaMultipleCompleta ||
															palabraSeleccionadaMultiple ||
															palabraSeleccionada
																? false
																: true
														}
													>
														<i className="fas fa-graduation-cap">{"⠀"}</i>
													</Button>
												</div>
												<div
													data-tut="ignorar"
													style={{
														display: "inline-block",
													}}
												>
													<OverlayTrigger
														key={5}
														delay={1000}
														overlay={
															<Tooltip id={5}>
																<strong
																	style={{
																		color: "white",
																		"font-weight": "bold",
																	}}
																>
																	Ignorar:{" "}
																</strong>
																¿Se trata de un nombre?, ¿un lugar?, o simplemente no
																deseas estudiar esta palabra, entonces
																<strong
																	style={{
																		color: "white",
																		"font-weight": "bold",
																	}}
																>
																	{" "}
																	¡Ignórala!
																</strong>{" "}
																para no llevar un registro de ella.
															</Tooltip>
														}
													>
														<Button
															size="sm"
															//style = {{ width: "30px"}}
															onClick={(e) => {
																handlerDificultad(5);
															}}
															disabled={
																seTradujoFrase ||
																palabraSeleccionadaMultipleCompleta ||
																palabraSeleccionadaMultiple ||
																palabraSeleccionada
																	? false
																	: true
															}
														>
															<span
																style={{
																	color: "white",
																}}
															>
																<i className="fas fa-ban">{"⠀"}</i>
															</span>
														</Button>
													</OverlayTrigger>
												</div>
											</div>
										</ButtonGroup>
									</Col>
								</Row>
								<Row>
									<Col>
										{audio ? (
											<AudioPlayer
												src={audio}
												layout="horizontal"
												autoPlay={false}
												style={{ boxShadow: "0" }}
												showDownloadProgress={false}
												customVolumeControls={[]}
												customAdditionalControls={[]}
												showJumpControls={false}
												className={audio ? `visible` : `invisible`}
											/>
										) : null}
									</Col>
								</Row>

								<Row className="mt-1">
									<Col className="align-items-center col text-center">
										{youtube ? <iframe title="ejemplo" src={youtube}></iframe> : null}

										{/* <Image
												width={"100%"}
												height={"70%"}
												//height="250"
												//width="550"
												src={textoInfo.imagen}
												style={{
													padding: "0% 0% 2% 10%",
												}}
											></Image> */}
									</Col>
								</Row>

								<Tour
									onRequestClose={() => setTour(false)}
									steps={tourConfig}
									isOpen={tour}
									className="helper"
									rounded={5}
									accentColor="#5cb7b7"
								/>
							</Container>
						) : null
					) : null}
				</div>
			);
		}
		return (
			<div>
				{userInfo && idiomasTotal ? (
					textoInfo === undefined ? (
						<Loader />
					) : textoInfo ? (
						<Container fluid>
							<Row>
								<Col>
									<h1 data-tut="titulo">{texto.nombre}</h1>
								</Col>

								<Col>
									<Button
										className="float-right"
										bsstyle="danger"
										bssize="small"
										variant="secondary"
										onClick={redirigirAModificarTexto}
									>
										<i className="fas fa-edit"></i>
									</Button>
									<Button
										data-tut="mensaje-final"
										className="float-right"
										bsstyle="danger"
										bssize="small"
										variant="secondary"
										onClick={() => setTour(true)}
									>
										Ayuda <i className="far fa-question-circle"></i>
									</Button>
								</Col>
							</Row>
							<Row>
								<Col>
									{loadingTexto ? (
										<Loader />
									) : (
										<div>
											<Scrollbars
												data-tut="contenido"
												className="text-justify"
												style={{
													//width: "30rem",
													height: "35.7rem",
												}}
												width={isMobile ? "100%" : "30rem"}
											>
												<p
													data-tut="contenido-interno"
													id="sel2"
													rows="5"
													cols="20"
													style={{
														padding: "7px",
														fontSize: "1.35em",
													}}
													onClick={(e) => getPalabra(e)}
													onMouseUp={(e) => getBuscarTraduccion(e)}
												></p>
											</Scrollbars>
											<br></br>

											<div
												data-tut="lectura-completada"
												style={{
													display: "inline-block",
												}}
											>
												<Button
													className="float-right"
													bsstyle="danger"
													bssize="small"
													size="md"
													onClick={(e) => handlerMarcorComoLeido(e)}
													disabled={estaLeido ? true : false}
												>
													<img
														alt="description"
														src={imagenCompletarLectura}
														style={{
															width: 20,
															height: 20,
															//border: "2px outset"
															//top: "1px"
															//padding: "0% 2% 2% 2%",
															//backgroundColor: "white",
														}}
													/>
												</Button>
											</div>
										</div>
									)}
								</Col>
								<Col>
									{youtube ? (
										<iframe title="ejemplo" height="250" width="550" src={youtube}></iframe>
									) : (
										<div
											style={{
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Image
												fluid
												className="d-block mx-auto"
												//con FLUID no hace falta setear la resolucion
												//height="250"
												//width="450vw"
												src={textoInfo.imagen}
												style={{
													paddingBottom: "2%",
													maxHeight: "275px",
												}}
											></Image>
										</div>
									)}
									{audio ? (
										<AudioPlayer
											src={audio}
											autoPlay={false}
											showJumpControls={false}
											className={audio ? `visible` : `invisible`}
										/>
									) : (
										<div>
											{/* {" "}
											<br />{" "}
											<h4>
												No hay audio asociado al texto
											</h4>{" "} */}
										</div>
									)}
									<br />
									<h5>
										SELECCIONASTE:{" "}
										{palabraSeleccionadaMultipleCompleta ? (
											/* POR DEFECTO EL COLOR DE BACKGORUND ES fcf8e3 PARA LOS <mark> ver el css */

											//ver página de colores http://html-color.org/es/FCF8E3
											<mark
											/* style={{
													"background-color":
														"#1ac6ff",
													padding: "0% 0% 0% 0%",
												}} */
											>
												{palabraSeleccionadaMultipleCompleta}
											</mark>
										) : (
											palabraSeleccionada && (
												<mark
												/* style={{
														"background-color":
															"yellow",
														padding: "0% 0% 0% 0%",
													}} */
												>
													{palabraSeleccionada}{" "}
												</mark>
											)
										)}{" "}
									</h5>

									<h5>
										<OverlayTrigger
											placement="right"
											delay={{
												show: 250,
												hide: 450,
											}}
											overlay={renderTooltip}
										>
											<span>
												Tú traducción:{" "}
												{palabraTraducida ? (
													<mark
														style={{
															"background-color": "#E3E7FC",
															padding: "0% 0% 0% 0%",
														}}
													>
														{palabraTraducida}
													</mark>
												) : (
													"-"
												)}
											</span>
										</OverlayTrigger>
									</h5>

									<h6> Seleccione la dificultad: </h6>
									<ButtonToolbar
										aria-label="Toolbar with button groups"
										style={{
											display: "flex",
											justifyContent: "center",
											alignItem: "center",
										}}
									>
										<ButtonGroup className="me-2" aria-label="First group">
											<div>
												{/* <Button
													onClick={(e) => {
														handlerDificultad(0);
														//updateDificultad(e, 0);
													}}
													disabled={
														seTradujoFrase ||
														palabraSeleccionadaMultipleCompleta ||
														palabraSeleccionadaMultiple ||
														palabraSeleccionada
															? false
															: true
													}
												>
													No vista
												</Button> */}{" "}
												<div
													data-tut="seleccion-dificultad"
													style={{
														display: "inline-block",
													}}
												>
													<OverlayTrigger
														key={1}
														delay={1000}
														overlay={
															<Tooltip id={1}>
																<strong
																	style={{
																		color: "green",
																	}}
																>
																	Fácil:{" "}
																</strong>
																¿Sientes que podrias estudiar un poco más esta palabra?
																Entonces Entonces márcala como{" "}
																<strong
																	style={{
																		color: "green",
																	}}
																>
																	Fácil!
																</strong>
															</Tooltip>
														}
													>
														<Button
															onClick={(e) => {
																//updateDificultad(e, 1);
																handlerDificultad(1);
															}}
															disabled={
																seTradujoFrase ||
																palabraSeleccionadaMultipleCompleta ||
																palabraSeleccionadaMultiple ||
																palabraSeleccionada
																	? false
																	: true
															}
														>
															<span
																style={{
																	color: "green",
																}}
															>
																<i className="fas fa-circle"></i>
															</span>
														</Button>
													</OverlayTrigger>{" "}
													<OverlayTrigger
														key={2}
														delay={1000}
														overlay={
															<Tooltip id={2}>
																<strong
																	style={{
																		color: "orange",
																	}}
																>
																	Media:{" "}
																</strong>
																Siempre te olvidas de esta palabra pero, ¿Sabes su
																significado? Entonces márcala como{" "}
																<strong
																	style={{
																		color: "orange",
																	}}
																>
																	Media!
																</strong>
															</Tooltip>
														}
													>
														<Button
															onClick={(e) => {
																handlerDificultad(2);
																//updateDificultad(e, 2);
															}}
															disabled={
																seTradujoFrase ||
																palabraSeleccionadaMultipleCompleta ||
																palabraSeleccionadaMultiple ||
																palabraSeleccionada
																	? false
																	: true
															}
														>
															<span
																style={{
																	color: "orange",
																}}
															>
																<i className="fas fa-circle"></i>
															</span>
														</Button>
													</OverlayTrigger>{" "}
													<OverlayTrigger
														key={3}
														delay={1000}
														overlay={
															<Tooltip id={3}>
																<strong
																	style={{
																		color: "tomato",
																	}}
																>
																	Difícil:{" "}
																</strong>
																Que el color no te asuste. ¿Es una palabra que la vez
																por primera vez? ¿Acaso es muy larga? Entonces márcala
																como{" "}
																<strong
																	style={{
																		color: "tomato",
																	}}
																>
																	Difícil!
																</strong>
															</Tooltip>
														}
													>
														<Button
															onClick={(e) => {
																handlerDificultad(3);
																//updateDificultad(e, 3);
															}}
															disabled={
																seTradujoFrase ||
																palabraSeleccionadaMultipleCompleta ||
																palabraSeleccionadaMultiple ||
																palabraSeleccionada
																	? false
																	: true
															}
														>
															<span
																style={{
																	color: "tomato",
																}}
															>
																<i className="fas fa-circle"></i>
															</span>
														</Button>
													</OverlayTrigger>
												</div>{" "}
												<div
													data-tut="aprendida"
													style={{
														display: "inline-block",
													}}
												>
													<Button
														onClick={(e) => {
															handlerDificultad(4);
															//updateDificultad(e, 4);
														}}
														disabled={
															seTradujoFrase ||
															palabraSeleccionadaMultipleCompleta ||
															palabraSeleccionadaMultiple ||
															palabraSeleccionada
																? false
																: true
														}
													>
														<i className="fas fa-graduation-cap"></i>
													</Button>
												</div>{" "}
												<div
													data-tut="ignorar"
													style={{
														display: "inline-block",
													}}
												>
													<OverlayTrigger
														key={5}
														delay={1000}
														overlay={
															<Tooltip id={5}>
																<strong
																	style={{
																		color: "white",
																		"font-weight": "bold",
																	}}
																>
																	Ignorar:{" "}
																</strong>
																¿Se trata de un nombre?, ¿un lugar?, o simplemente no
																deseas estudiar esta palabra, entonces
																<strong
																	style={{
																		color: "white",
																		"font-weight": "bold",
																	}}
																>
																	{" "}
																	¡Ignórala!
																</strong>{" "}
																para no llevar un registro de ella.
															</Tooltip>
														}
													>
														<Button
															onClick={(e) => {
																handlerDificultad(5);
															}}
															disabled={
																seTradujoFrase ||
																palabraSeleccionadaMultipleCompleta ||
																palabraSeleccionadaMultiple ||
																palabraSeleccionada
																	? false
																	: true
															}
														>
															<span
																style={{
																	color: "white",
																}}
															>
																<i className="fas fa-ban"></i>
															</span>
														</Button>
													</OverlayTrigger>
												</div>
											</div>
										</ButtonGroup>
									</ButtonToolbar>
									<p></p>

									{texto.idioma_objeto ? (
										texto.idioma_objeto.name === userInfo.idioma ? (
											<Form.Text className="text-muted">
												Función desabilitada, su idioma de perfil coincide con el idioma del
												texto.
											</Form.Text>
										) : null
									) : null}

									<p></p>
									{/*}
									<span>
										Traducción de{" "}
										{idiomasTotal.map((obj) => {
											if (obj.id === texto.idioma) {
												return obj.name;
											} else {
												return false;
											}
										})}{" "}
										a{" "}
										{userInfo && idiomasTotal
											? userInfo.idioma
											: null}
									</span>*/}
									<div>
										<Row className="align-items-center">
											<Col md={8} xs={12}>
												<Form.Group data-tut="resultado-traducir" controlId="traduccion">
													<Form.Label>
														<span>
															Traducción de{" "}
															{idiomasTotal.map((obj) => {
																if (obj.id === texto.idioma) {
																	return obj.name;
																} else {
																	return false;
																}
															})}{" "}
															a {userInfo && idiomasTotal ? userInfo.idioma : null}
														</span>
													</Form.Label>
													<Form.Control
														//size="lg"
														type="text"
														//style={{ height: "50px" }}
														placeholder="Aquí aparecerán las traducciones"
														value={palabraTraducida}
														onChange={(e) => {
															setTraduccion(e.target.value);
														}}
														onKeyDown={onSubmitTraduccion}
													></Form.Control>
												</Form.Group>
											</Col>
											<Col className="text-right" style={{ height: "65px" }} md={4} xs={3}>
												<ButtonGroup aria-label="Toolbar with button groups">
													<Button
														data-tut="boton-traducir"
														variant="primary"
														className="my-3 mr-1"
														style={{
															height: "45px",
															paddingTop: "9px",
														}}
														onClick={handlerTraduccion}
														disabled={
															(texto.idioma_objeto
																? texto.idioma_objeto.name === userInfo.idioma
																: false) ||
															(!palabraSeleccionada &&
																!palabraSeleccionadaMultipleCompleta)
														}
													>
														<img
															alt="description"
															src={imagenTraduccion}
															style={{
																width: 20,
																height: 20,
																//border: "2px outset"
																//top: "1px"
																//padding: "0% 2% 2% 2%",
																//backgroundColor: "white",
															}}
														/>
													</Button>

													<Button
														className="my-3"
														style={{
															height: "45px",
														}}
														onClick={handlerGuardarTraduccion}
														disabled={palabraTraducida === ""}
													>
														<Image
															alt="imagenEnviar"
															src={imagenEnviar}
															style={{
																width: 20,
																height: 20,
																//border: "2px outset"
																//top: "1px"
																//padding: "0% 2% 2% 2%",
																//backgroundColor: "white",
															}}
														/>
													</Button>
												</ButtonGroup>
											</Col>
										</Row>
									</div>
								</Col>
							</Row>

							<Tour
								onRequestClose={() => setTour(false)}
								steps={tourConfig}
								isOpen={tour}
								className="helper"
								rounded={5}
								accentColor="#5cb7b7"
							/>
						</Container>
					) : null
				) : null}
			</div>
		);
	};

	return renderContent();
}

export default EstudiarScreen;
