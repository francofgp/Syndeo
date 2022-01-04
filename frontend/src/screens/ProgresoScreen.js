import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIdiomasUser } from "../redux/actions/IdiomasActions";
import { Container, Image, Row, Col, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import LineChart from "../components/Graficos/LineChart";
import Polar from "../components/Graficos/Polar";
import MultiAxisLine from "../components/Graficos/MultiAxisLine";
import VerticalBar from "../components/Graficos/VerticalBar";
import ProfileCard from "../components/ProfileCard";
import MetaDiaria from "../components/MetaDiaria";
import { Progress } from "react-sweet-progress";
import "react-sweet-progress/lib/style.css";
import Loader from "../components/Loader";
import {
	cantidadPalabrasRepasadas,
	cantidadPalabrasNuevas,
	cantidadDificultad,
	getMetaDiaria,
	cantidadPalabrasRepasadasIdioma,
	cantidadNuevasPorIdioma,
	cantidadNoVistasVistasPorIdioma,
	cantidadAprendidasPorIdioma,
} from "../redux/actions/progresoActions";
import { getPerfilInfo, getPerfilInfoEstadistica } from "../redux/actions/userActions";
import {
	FacebookShareButton,
	FacebookIcon,
	TwitterShareButton,
	TwitterIcon,
	WhatsappShareButton,
	WhatsappIcon,
} from "react-share";
import Message from "../components/Message";
import Tour from "reactour";
import hi from "../data/imagenesProgreso/hi.gif";
import globo from "../data/imagenesProgreso/globo.gif";
import ojo from "../data/imagenesProgreso/ojo.gif";
import gorroDeGraduacion from "../data/imagenesProgreso/gorroDeGraduacion.svg";

function ProgresoScreen({ history }) {
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userInfoRedux = useSelector((state) => state.userInfo);
	const { user, success: successUserInfo, loading: loadingUserInfo } = userInfoRedux;

	const perfilInfoEstadisticaRedux = useSelector((state) => state.perfilInfoEstadistica);
	const {
		userInfoEstadistica,
		success: successPerfilInfoEstadistica,
		loading: loadingPerfilInfoEstadistica,
	} = perfilInfoEstadisticaRedux;

	const idiomasUser = useSelector((state) => state.idiomasUser);
	const { idiomasUserTotal, success: successIdiomasUser } = idiomasUser;

	const cantidadPalabrasRepasadasRedux = useSelector((state) => state.cantidadPalabrasRepasadas);
	const {
		loading: loadingCantidadPalabrasRepasadas,
		success: successPalabrasRepasadas,
		palabras: palabrasRepasadasRedux,
	} = cantidadPalabrasRepasadasRedux;

	const cantidadPalabrasNuevasRedux = useSelector((state) => state.cantidadPalabrasNuevas);
	const {
		loading: loadingCantidadNuevasRepasadas,
		success: successPalabrasNuevas,
		palabras: palabrasNuevasRedux,
	} = cantidadPalabrasNuevasRedux;

	const cantidadDificultadRedux = useSelector((state) => state.cantidadDificultad);
	const {
		loading: loadingCantidadDificultad,
		success: successCantidadDificultad,
		palabras: cantidadDificultadPalabras,
	} = cantidadDificultadRedux;

	const metaDiariaRedux = useSelector((state) => state.progresoMetaDiaria);
	const { success: successMetaDiaria, estadistica, loading: loadingMetaDiaria } = metaDiariaRedux;

	const cantidadRepasadasPorIdiomaRedux = useSelector((state) => state.cantidadPalabrasRepasadasIdioma);
	const {
		success: successPalabrasRepasadasIdioma,
		loading: loadingPalabrasRepasadasIdioma,
		palabras: palabrasRepasadasIdioma,
	} = cantidadRepasadasPorIdiomaRedux;

	const cantidadNuevasPorIdiomaRedux = useSelector((state) => state.cantidadNuevasIdioma);
	const {
		success: successNuevasPorIdioma,
		loading: loadingNuevasPorIdioma,
		palabras: palabrasNuevasIdioma,
	} = cantidadNuevasPorIdiomaRedux;

	const cantidadNoVistasVistasPorIdiomaRedux = useSelector((state) => state.cantidadVistasNoVistas);
	const {
		success: successCantidadNoVistasVistasPorIdioma,
		loading: loadingCantidadNoVistasVistasPorIdioma,
		palabras: palabrasCantidadNoVistasVistasPorIdioma,
	} = cantidadNoVistasVistasPorIdiomaRedux;

	const cantidadAprendidasPorIdiomaRedux = useSelector((state) => state.cantidadAprendidasPorIdioma);
	const {
		success: successCantidadAprendidasPorIdioma,
		loading: loadingCantidadAprendidasPorIdioma,
		palabras: palabrasCantidadAprendidasPorIdioma,
	} = cantidadAprendidasPorIdiomaRedux;

	const [palabrasRepasadas, setPalabrasRepasadas] = useState([]);
	const [palabrasNuevas, setPalabrasNuevas] = useState([]);
	const [palabrasDificultad, setPalabrasDificultad] = useState([]);
	const [palabrasRepasadasPorIdioma, setPalabrasRepasadasPorIdioma] = useState([]);
	const [palabrasNuevasPorIdioma, setPalabrasNuevasPorIdioma] = useState([]);
	const [palabrasAprendidasPorIdioma, setPalabrasAprendidasPorIdioma] = useState([]);
	const [palabrasNoVistasVistasPorIdioma, setPalabrasNoVistasVistasPorIdioma] = useState([]);
	const [show, setShow] = useState(false);
	const [idioma, setIdioma] = useState("");
	const [tituloPolar, setTituloPolar] = useState("");
	const [idiomaSegundoSelect, setIdiomaSegundoSelect] = useState("");
	const [infoPerfil, setInfoPerfil] = useState({});
	const [infoPerfilEstadistica, setInfoPerfilEstadistica] = useState([]);
	const [periodoPorIdioma, setPeriodoPorIdioma] = useState("semana");
	const [metaDiaria, setMetaDiaria] = useState([
		{ cantidad: 0 },
		{ meta: 0 },
		{ esMeta: false },
		{ fecha: "2000-12-12" },
	]);
	const [tour, setTour] = useState(false);

	const dispatch = useDispatch();

	//-------------------------------------------------------------
	useEffect(() => {
		if (!userInfo) {
			history.push("/login?redirect=/progreso");
		}
	}, [history, userInfo]);

	useEffect(() => {
		if (successPalabrasNuevas) {
			setPalabrasNuevas(palabrasNuevasRedux.estadistica);
		}
	}, [palabrasNuevasRedux, successPalabrasNuevas]);

	useEffect(() => {
		if (palabrasRepasadasRedux) {
			setPalabrasRepasadas(palabrasRepasadasRedux.estadistica);
		}
	}, [palabrasRepasadasRedux, successPalabrasRepasadas]);

	useEffect(() => {
		if (estadistica) {
			setMetaDiaria(estadistica.estadistica);
		}
	}, [estadistica, successMetaDiaria]);

	useEffect(() => {
		if (successUserInfo) {
			setInfoPerfil(user);
		}
	}, [dispatch, successUserInfo, user]);

	useEffect(() => {
		if (successPerfilInfoEstadistica) {
			setInfoPerfilEstadistica(userInfoEstadistica);
		}
	}, [dispatch, successPerfilInfoEstadistica, userInfoEstadistica]);

	useEffect(() => {
		if (successCantidadDificultad) {
			setPalabrasDificultad(cantidadDificultadPalabras.estadistica);
		}
	}, [dispatch, cantidadDificultadPalabras, successCantidadDificultad]);

	useEffect(() => {
		if (successPalabrasRepasadasIdioma) {
			setPalabrasRepasadasPorIdioma(palabrasRepasadasIdioma.estadistica);
		}
	}, [palabrasRepasadasIdioma, successPalabrasRepasadasIdioma]);

	useEffect(() => {
		if (successNuevasPorIdioma) {
			setPalabrasNuevasPorIdioma(palabrasNuevasIdioma.estadistica);
		}
	}, [palabrasNuevasIdioma, successNuevasPorIdioma]);

	useEffect(() => {
		if (successCantidadNoVistasVistasPorIdioma) {
			setPalabrasNoVistasVistasPorIdioma(palabrasCantidadNoVistasVistasPorIdioma.estadistica);
		}
	}, [palabrasCantidadNoVistasVistasPorIdioma, successCantidadNoVistasVistasPorIdioma]);

	useEffect(() => {
		if (successCantidadAprendidasPorIdioma) {
			setPalabrasAprendidasPorIdioma(palabrasCantidadAprendidasPorIdioma.estadistica);
		}
	}, [palabrasCantidadAprendidasPorIdioma, successCantidadAprendidasPorIdioma]);

	useEffect(() => {
		if (!successIdiomasUser) {
			dispatch(getIdiomasUser());
		} else if (successIdiomasUser && idiomasUserTotal.length > 0) {
			setIdiomaSegundoSelect(idiomasUserTotal !== "" ? idiomasUserTotal[0].id : idiomaSegundoSelect);
			dispatch(cantidadPalabrasRepasadasIdioma(idiomasUserTotal[0].id, "semana"));
			dispatch(cantidadNuevasPorIdioma(idiomasUserTotal[0].id, "semana"));
			dispatch(cantidadNoVistasVistasPorIdioma(idiomasUserTotal[0].id, "semana"));
			dispatch(cantidadAprendidasPorIdioma(idiomasUserTotal[0].id, "semana"));
			dispatch(cantidadPalabrasNuevas("semana"));
			dispatch(cantidadPalabrasRepasadas("semana"));
			dispatch(getPerfilInfo());
			dispatch(getPerfilInfoEstadistica());
			dispatch(cantidadDificultad(""));
			setShow(true);
			setTituloPolar("DIFICULTAD DE TODAS LAS PALABRAS");
			dispatch(getMetaDiaria());
			//setIdioma(idiomasUserTotal[0].id)
		} else {
			dispatch(getPerfilInfo());
			dispatch(getPerfilInfoEstadistica());
			dispatch(getMetaDiaria());
		}
	}, [dispatch, successIdiomasUser]);

	//-------------------------------------------------------------

	const handlerNuevasPalabras = (e) => {
		dispatch(cantidadPalabrasNuevas(e));
	};

	const handlerPalabrasRepasadas = (e) => {
		dispatch(cantidadPalabrasRepasadas(e));
	};

	const handlerDificultad = (e) => {
		setIdioma(parseInt(e.target.value));
		dispatch(cantidadDificultad(e.target.value));
		setTituloPolar("Dificultad");
	};

	const handlerTotalDificultadPolar = (e) => {
		dispatch(cantidadDificultad(""));
		setTituloPolar("DIFICULTAD DE TODAS LAS PALABRAS");
	};

	const handlerPalabrasRepasadasIdioma = (e) => {
		var periodoLocal;
		var idiomaLocal;
		if (isNaN(parseInt(e.target.value))) {
			setPeriodoPorIdioma(e.target.value);
			periodoLocal = e.target.value;
		} else {
			setIdiomaSegundoSelect(e.target.value);
			idiomaLocal = e.target.value;
		}
		dispatch(
			cantidadPalabrasRepasadasIdioma(
				idiomaLocal ? idiomaLocal : idiomaSegundoSelect,
				periodoLocal ? periodoLocal : periodoPorIdioma
			)
		);
	};

	const handlerPalabrasNuevas = (e) => {
		var periodoLocal;
		var idiomaLocal;
		if (isNaN(parseInt(e.target.value))) {
			setPeriodoPorIdioma(e.target.value);
			periodoLocal = e.target.value;
		} else {
			setIdiomaSegundoSelect(e.target.value);
			idiomaLocal = e.target.value;
		}
		dispatch(
			cantidadNuevasPorIdioma(
				idiomaLocal ? idiomaLocal : idiomaSegundoSelect,
				periodoLocal ? periodoLocal : periodoPorIdioma
			)
		);
	};

	const handlerCantidadNoVistasVistasPorIdioma = (e) => {
		var periodoLocal;
		var idiomaLocal;
		if (isNaN(parseInt(e.target.value))) {
			setPeriodoPorIdioma(e.target.value);
			periodoLocal = e.target.value;
		} else {
			setIdiomaSegundoSelect(e.target.value);
			idiomaLocal = e.target.value;
		}
		dispatch(
			cantidadNoVistasVistasPorIdioma(
				idiomaLocal ? idiomaLocal : idiomaSegundoSelect,
				periodoLocal ? periodoLocal : periodoPorIdioma
			)
		);
	};

	const handlerCantidadAprendidasPorIdioma = (e) => {
		var periodoLocal;
		var idiomaLocal;
		if (isNaN(parseInt(e.target.value))) {
			setPeriodoPorIdioma(e.target.value);
			periodoLocal = e.target.value;
		} else {
			setIdiomaSegundoSelect(e.target.value);
			idiomaLocal = e.target.value;
		}
		dispatch(
			cantidadAprendidasPorIdioma(
				idiomaLocal ? idiomaLocal : idiomaSegundoSelect,
				periodoLocal ? periodoLocal : periodoPorIdioma
			)
		);
	};

	const calcularEdad = (fechaNacimiento) => {
		if (fechaNacimiento) {
			var parts = fechaNacimiento.split("-");
			// Please pay attention to the month (parts[1]); JavaScript counts months from 0:
			// January - 0, February - 1, etc.
			var dateNacimiento = new Date(parts[0], parts[1] - 1, parts[2]);

			var diaActual = new Date();
			var years = diaActual.getFullYear() - dateNacimiento.getFullYear();

			if (
				diaActual.getMonth() < dateNacimiento.getMonth() ||
				(diaActual.getMonth() == dateNacimiento.getMonth() && diaActual.getDate() < dateNacimiento.getDate())
			) {
				years--;
			}

			return years;
		}

		return "Cargando...";
	};

	const dataPalabrasRepasadas = {
		labels: palabrasRepasadas.map((o) => Object.keys(o)[0]),
		datasets: [
			{
				label: "# de palabras",
				data: palabrasRepasadas.map((o) => Object.values(o)[0]),
				fill: false,
				backgroundColor: "rgb(255, 99, 132)",
				borderColor: "rgba(255, 99, 132, 0.2)",
			},
		],
	};

	const dataPalabrasNuevas = {
		labels: palabrasNuevas.map((o) => Object.keys(o)[0]),
		datasets: [
			{
				label: "# de palabras",
				data: palabrasNuevas.map((o) => Object.values(o)[0]),
				fill: false,
				backgroundColor: "rgba(54, 162, 235, 1)",
				borderColor: "rgba(54, 162, 235, 0.2)",
			},
		],
	};

	const dataPalabrasDificultad = {
		labels: palabrasDificultad.map((o) => Object.keys(o)[0]),
		datasets: [
			{
				label: "# of Votes",
				data: palabrasDificultad.map((o) => Object.values(o)[0]),
				backgroundColor: [
					"rgba(54, 162, 235, 0.5)",
					"rgba(75, 192, 192, 0.5)",
					"rgba(255, 206, 86, 0.5)",
					"rgba(255, 99, 132, 0.5)",
					"rgba(153, 102, 255, 0.5)",
					"rgba(255, 159, 64, 0.5)",
				],
				borderWidth: 1,
			},
		],
	};

	const dataMultiAxisIdioma = {
		labels: palabrasRepasadasPorIdioma.map((o) => Object.keys(o)[0]),
		datasets: [
			{
				label: "# Repasadas",
				data: palabrasRepasadasPorIdioma.map((o) => Object.values(o)[0]),
				fill: false,
				backgroundColor: "rgb(255, 99, 132)",
				borderColor: "rgba(255, 99, 132, 0.2)",
				yAxisID: "y-axis-1",
			},
			{
				label: "# Nuevas",
				data: palabrasNuevasPorIdioma.map((o) => Object.values(o)[0]),
				fill: false,
				backgroundColor: "rgb(54, 162, 235)",
				borderColor: "rgba(54, 162, 235, 0.2)",
				yAxisID: "y-axis-1",
				/* yAxisID: "y-axis-2", */
			},
		],
	};

	const dataPalabrasRepasadasPorIdioma = {
		labels: palabrasRepasadasPorIdioma.map((o) => Object.keys(o)[0]),
		datasets: [
			{
				label: "# Repasadas",
				data: palabrasRepasadasPorIdioma.map((o) => Object.values(o)[0]),
				fill: false,
				backgroundColor: "rgba(255, 159, 64, 1)",
				borderColor: "rgba(255, 159, 64, 0.2)",
			},
		],
	};

	const dataPalabrasNuevasPorIdioma = {
		labels: palabrasNuevasPorIdioma.map((o) => Object.keys(o)[0]),
		datasets: [
			{
				label: "# Nuevas",
				data: palabrasNuevasPorIdioma.map((o) => Object.values(o)[0]),
				fill: false,
				backgroundColor: "rgba(75, 192, 192, 1)",
				borderColor: "rgba(75, 192, 192, 0.2)",
			},
		],
	};

	const dataPabrasNoVistasVistas = {
		labels: palabrasNoVistasVistasPorIdioma.map((o) => Object.keys(o)[0]),
		datasets: [
			{
				label: ["# Palabras"],
				data: palabrasNoVistasVistasPorIdioma.map((o) => Object.values(o)[0]),
				backgroundColor: [
					"rgba(54, 162, 235, 0.2)",
					"rgba(255, 99, 132, 0.2)",
					"rgba(255, 206, 86, 0.2)",
					"rgba(75, 192, 192, 0.2)",
					"rgba(153, 102, 255, 0.2)",
					"rgba(255, 159, 64, 0.2)",
				],
				borderColor: [
					"rgba(54, 162, 235, 1)",
					"rgba(255, 99, 132, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
				],
				borderWidth: 1,
			},
		],
	};

	const dataPalabrasAprendidas = {
		labels: palabrasAprendidasPorIdioma.map((o) => Object.keys(o)[0]),
		datasets: [
			{
				label: "# Aprendidas",
				data: palabrasAprendidasPorIdioma.map((o) => Object.values(o)[0]),
				fill: false,
				backgroundColor: "rgba(153, 102, 255, 1)",
				borderColor: "rgba(153, 102, 255, 0.2)",
			},
		],
	};

	const urlBotonCompartir = "http://syndeoapp.herokuapp.com/";
	const fraseBoton = `He aprendido ${
		infoPerfilEstadistica.estadistica ? infoPerfilEstadistica.estadistica[2].cantidadVocabulario : 0
	} palabras con Syndeo. \n¿Qué esperas para sumarte? 🤓`;

	const tourConfig = [
		{
			selector: '[data-tut="foto-perfil"]',
			content: () => (
				<div className="text-center">
					<h3>¡Hola {infoPerfil && infoPerfil.name}!</h3>
					<Image
						src={hi}
						rounded
						fluid
						style={{
							width: "60px",
							height: "58px",
							display: "block",
							marginLeft: "auto",
							marginRight: "auto",
						}}
					/>{" "}
					En esta sección podrás ver tu perfil, como también el progreso que haz hecho en la plataforma.
				</div>
			),
			highlightedSelectors: ['[data-tut="foto-perfil"]'],
		},
		{
			selector: '[data-tut="stats-perfil"]',
			content: () => (
				<div className="text-center">
					<h3>
						<i className="fas fa-eye"></i>
					</h3>
					Aquí podrás echar un vistazo rápido a tu progreso.{" "}
				</div>
			),
		},
		{
			selector: '[data-tut="textos-leidos"]',
			content: () => (
				<div className="text-justify">
					<h4 className="text-center">Textos leídos:</h4>
					Cuando hayas terminado de leer uno de tus textos, no te olvides de marcarlo como leído.{" "}
				</div>
			),
			position: "left	",
		},
		{
			selector: '[data-tut="palabras-leidas"]',
			content: () => (
				<div className="text-justify">
					<h4 className="text-center">Palabras leídas:</h4>
					También contaremos las palabras de lo que hayas leído.{" "}
				</div>
			),
			position: "left	",
		},
		{
			selector: '[data-tut="vocabulario-perfil"]',
			content: () => (
				<div className="text-justify">
					<h4 className="text-center">Vocabulario:</h4>
					¡Continúa leyendo para ampliar tu vocabulario cada vez más!
				</div>
			),
			position: "left	",
		},
		{
			selector: '[data-tut="desafio-diario"]',
			content: () => (
				<div className="text-justify">
					<h4 className="text-center">
						Desafío diario <i className="fas fa-ruler"></i>:
					</h4>
					¿Cuántas palabras nuevas quieres aprender por día? ¿10, 20, 50? Siempre puedes cambiar el valor
					desde tu perfil.
					<br></br>
					Cuando hayas alcanzado tu meta diaria, ¡Te lo haremos saber!
				</div>
			),
		},
		{
			selector: '[data-tut="repasadas-nuevas-total"]',
			content: () => (
				<div className="text-justify">
					Aquí podrás ver las palabras repasadas y nuevas de todos los idiomas que estés estudiando.
				</div>
			),
		},
		{
			selector: '[data-tut="repasadas-total"]',
			content: () => (
				<div className="text-justify">
					<h3 className="text-center">Palabras Repasadas:</h3>
					¿Has repasado tu vocabulario con las flashcards? Si es así, aquí verás todas las veces que hayas
					repasado tus palabras.
				</div>
			),
		},
		{
			selector: '[data-tut="nuevas-total"]',
			content: () => (
				<div className="text-justify">
					<h3 className="text-center">Palabras nuevas:</h3>
					¿Recuerdas las palabras <span style={{ color: "blue", fontWeight: 900 }}>azules</span>? Bueno,
					cuando les cambies la dificultad por primera vez, ¡serán nuevas!
				</div>
			),
		},
		{
			selector: '[data-tut="eleccion-de-periodo"]',
			content: () => (
				<div className="text-justify">
					<h3 className="text-center">
						Período <i className="fas fa-calendar-alt"></i>:
					</h3>
					Ah, por cierto, siempre puedes ver tu progreso semanal o mensual.
				</div>
			),
		},
		{
			selector: '[data-tut="grafico-polar"]',
			content: () => (
				<div className="text-justify">
					<h3 className="text-center">
						Dificultad de las palabras <i className="fas fa-chart-pie"></i>:
					</h3>
					Aquí podrás ver la cantidad de palabras por dificultad.
				</div>
			),
		},
		{
			selector: '[data-tut="total-grafico-polar"]',
			content: () => <div className="text-justify">Puedes elegir entre ver la de todos tus idiomas.</div>,
		},
		{
			selector: '[data-tut="seleccion-idioma-grafico-polar"]',
			content: () => <div className="text-justify">Como también, la de alguno en particular.</div>,
		},
		{
			selector: '[data-tut="analisis-por-idioma"]',
			content: () => (
				<div className="text-justify">
					<h5 className="text-center">¿Quieres ver un idioma en especial?</h5>
					<Image
						src={globo}
						rounded
						fluid
						style={{
							width: "200px",
							height: "150px",
							display: "block",
							marginLeft: "auto",
							marginRight: "auto",
						}}
					/>{" "}
					Aquí podrás seleccionar entre todos tus idiomas, para ver en detalle cada uno.
				</div>
			),
		},
		{
			selector: '[data-tut="no-vistas-y-vistas"]',
			content: () => (
				<div>
					<h3 className="text-center">No vistas y Nuevas:</h3>
					<div className="text-justify">
						<Image
							className="mb-1"
							src={ojo}
							rounded
							fluid
							style={{
								width: "139px",
								height: "44px",
								display: "block",
								marginLeft: "auto",
								marginRight: "auto",
							}}
						/>
						Aquí podrás ver la relación entre tus palabras{" "}
						<span style={{ color: "blue", fontWeight: 900 }}>no vistas</span> y las{" "}
						<span className="cambiar-color-random-sin-azul" style={{ color: "blue", fontWeight: 900 }}>
							nuevas
						</span>
						.
					</div>
				</div>
			),
		},
		{
			selector: '[data-tut="palabras-aprendidas"]',
			content: () => (
				<div>
					<h3 className="text-center">Palabras Aprendidas:</h3>
					<div className="text-justify">
						<Image
							id="imagen-con-movimiento"
							className="mb-1"
							src={gorroDeGraduacion}
							rounded
							fluid
							style={{
								width: "102x",
								height: "102px",
								display: "block",
								marginLeft: "auto",
								marginRight: "auto",
							}}
						/>
						Aquí verás todas las palabras que hayaz marcado como aprendidas (
						<i className="fas fa-graduation-cap"></i>) cuando estuviste leyendo tus textos.
					</div>
				</div>
			),
		},
		{
			selector: '[data-tut="mensaje-final"]',
			content: () => (
				<div className="text-justify">
					<h4 className="text-center">
						Ver de Nuevo <i className="fas fa-redo">:</i>
					</h4>
					Siempre puedes ver este mensaje cuantas veces quieras, ahora anímate a probarlo por tí mismo 😉.
					<br></br>
					<br></br>
					<div className="animated-shadow-quote">
						<blockquote>
							<p>
								<q>
									La capacidad y gusto por la lectura da acceso a lo que ya ha sido descubierto por
									otros
								</q>
							</p>
							<footer>Abraham Lincoln</footer>
						</blockquote>
					</div>
				</div>
			),
		},
	];

	return (
		<div>
			{userInfo && idiomasUserTotal ? (
				<div>
					<MetaDiaria />
					<Container fluid="md" xs={6}>
						<Row className="align-items-center">
							<h1>Mi Progreso</h1>
							<Col className="text-right mr-3">
								<Button data-tut="mensaje-final" variant="secondary" onClick={() => setTour(true)}>
									Ayuda <i className="far fa-question-circle"></i>
								</Button>
								<div className="Demo__some-network">
									<FacebookShareButton
										className="Demo__some-network__share-button"
										url={urlBotonCompartir}
										quote={fraseBoton}
										hashtag="Syndeo"
									>
										<FacebookIcon size={32} round />
									</FacebookShareButton>
								</div>

								<div className="Demo__some-network">
									<TwitterShareButton
										className="Demo__some-network__share-button"
										url={urlBotonCompartir}
										title={fraseBoton}
										hashtag="#Syndeo"
									>
										<TwitterIcon size={32} round />
									</TwitterShareButton>
								</div>

								<div className="Demo__some-network">
									<WhatsappShareButton
										url={urlBotonCompartir}
										title={fraseBoton}
										separator=": : "
										className="Demo__some-network__share-button"
									>
										<WhatsappIcon size={32} round />
									</WhatsappShareButton>
								</div>
							</Col>
						</Row>

						<Row>
							{loadingUserInfo || loadingPerfilInfoEstadistica ? (
								<Loader />
							) : (
								<Col>
									<div data-tut="tarjeta-perfil">
										<ProfileCard
											nombre={infoPerfil.name}
											imagenPerfil={infoPerfil.imagenPerfil}
											imagenPortada={infoPerfil.imagenPortada}
											descripcion={infoPerfil.descripcion}
											edad={calcularEdad(infoPerfil.fecha_nacimiento)}
											pais={infoPerfil.pais}
											cantidadTextosLeidos={
												infoPerfilEstadistica.estadistica
													? infoPerfilEstadistica.estadistica[1].textosLeidos
													: null
											}
											cantidadPalabrasLeidas={
												infoPerfilEstadistica.estadistica
													? infoPerfilEstadistica.estadistica[0].palabrasLeidas === null
														? 0
														: infoPerfilEstadistica.estadistica[0].palabrasLeidas
													: null
											}
											cantidadVocabulario={
												infoPerfilEstadistica.estadistica
													? infoPerfilEstadistica.estadistica[2].cantidadVocabulario
													: 0
											}
										/>
									</div>
								</Col>
							)}
						</Row>

						<Row className="justify-content-center">
							<Col data-tut="desafio-diario" md={11}>
								<h4>Desafío diario</h4>
								{loadingMetaDiaria ? (
									<Loader />
								) : (
									<Progress
										theme={{
											success: {
												symbol: `${metaDiaria[0].cantidad}/${metaDiaria[1].meta} 🥳‍`,
												color: "#4BB543",
											},
											active: {
												symbol: `${metaDiaria[0].cantidad}/${metaDiaria[1].meta} 😀`,
												color: "#fbc630",
											},
											default: {
												symbol: `${metaDiaria[0].cantidad}/${metaDiaria[1].meta} 😱`,
												color: "#fbc630",
											},
										}}
										percent={
											(metaDiaria[0].cantidad / metaDiaria[1].meta) * 100 <= 100
												? (metaDiaria[0].cantidad / metaDiaria[1].meta) * 100
												: 100
										}
									/>
								)}
							</Col>
						</Row>
						<br></br>
						<br></br>
						<br></br>

						{idiomasUserTotal.length === 0 && idiomasUserTotal ? (
							<Message variant="info">
								<Alert.Heading> Vuelve la proxima vez que hayas estudiado un texto.🤓 </Alert.Heading>
							</Message>
						) : (
							<div>
								<Row data-tut="repasadas-nuevas-total">
									<Col data-tut="repasadas-total" md={6}>
										<h4>Palabras Repasadas</h4>
										<Form.Group controlId="cantidadRepasadas">
											<Form.Label>Cantidad de palabras repasadas</Form.Label>
											<div data-tut="eleccion-de-periodo">
												<select
													className="form-control"
													onChange={(e) => handlerPalabrasRepasadas(e.target.value)}
												>
													<option value="semana">Semanal</option>
													<option value="mes">Mensual</option>
												</select>
											</div>
										</Form.Group>
										{loadingCantidadPalabrasRepasadas ? (
											<Loader />
										) : (
											<LineChart data={dataPalabrasRepasadas} titulo={""} />
										)}
									</Col>

									<Col data-tut="nuevas-total" md={6} className="text-justify">
										<h4>Palabras nuevas</h4>

										<Form.Group controlId="cantidadRepasadas">
											<Form.Label>Cantidad de palabras nuevas</Form.Label>
											<div>
												<select
													className="form-control"
													onChange={(e) => handlerNuevasPalabras(e.target.value)}
												>
													<option value="semana">Semanal</option>
													<option value="mes">Mensual</option>
												</select>
											</div>
										</Form.Group>
										{loadingCantidadNuevasRepasadas ? (
											<Loader />
										) : (
											<LineChart data={dataPalabrasNuevas} titulo={""} />
										)}
									</Col>
								</Row>
								<br />
								<Row className="align-items-center">
									<Col md={10} xs={12}>
										<h4>{tituloPolar}</h4>
										<label>Cantidad de palabras por dificultad</label>
										{idiomasUserTotal !== "" && (
											<div>
												<select
													data-tut="seleccion-idioma-grafico-polar"
													id="idioma"
													className="form-control "
													//style={{ width: "68em" }}

													value={idioma ? idioma : ""}
													onChange={(e) => {
														handlerDificultad(e);
													}}
												>
													{idiomasUserTotal.map((obj) => {
														/*
													if (obj.id === idioma) {
														return (
															<option
																key={obj.id}
																value={obj.id}
															//selected
															>
																{obj.name}
															</option>
														);
													} else {
														*/
														return (
															<option key={obj.id} value={obj.id}>
																{obj.name}
															</option>
														);
													})}
												</select>
											</div>
										)}
									</Col>
									<Col className="text-right" style={{ height: "48px" }}>
										<Button
											data-tut="total-grafico-polar"
											className="my-3"
											style={{ height: "45px" }}
											onClick={(e) => handlerTotalDificultadPolar(e)}
										>
											Total
										</Button>
									</Col>
								</Row>
								<Row data-tut="grafico-polar">
									<Col md={{ span: 10, offset: 1 }}>
										{loadingCantidadDificultad ? (
											<Loader />
										) : (
											<Polar data={dataPalabrasDificultad} titulo={""} />
										)}
									</Col>
								</Row>
								<br />
								<div data-tut="analisis-por-idioma">
									<Row>
										<Col>
											<h4>Analice su avance en cada idioma</h4>
											<Form.Label>Seleccione idioma</Form.Label>
											{idiomasUserTotal !== "" && (
												<div>
													<select
														id="idioma"
														className="form-control "
														value={idiomaSegundoSelect}
														onChange={(e) => {
															handlerPalabrasRepasadasIdioma(e);
															handlerPalabrasNuevas(e);
															handlerCantidadNoVistasVistasPorIdioma(e);
															handlerCantidadAprendidasPorIdioma(e);
															setShow(true);
														}}
													>
														{idiomasUserTotal.map((obj) => {
															/*
													if (obj.id === idioma) {
														return (
															<option
																key={obj.id}
																value={obj.id}
															//selected
															>
																{obj.name}
															</option>
														);
													} else {*/
															return (
																<option key={obj.id} value={obj.id}>
																	{obj.name}
																</option>
															);
															//}
														})}
													</select>
												</div>
											)}
										</Col>
									</Row>
									<br />
									<Row>
										<Col>
											<Form.Group controlId="periodoPorIdiomaId">
												<Form.Label>Seleccione período:</Form.Label>
												<div>
													<select
														className="form-control"
														value={periodoPorIdioma}
														onChange={(event) => {
															setPeriodoPorIdioma(event.target.value);
															handlerPalabrasRepasadasIdioma(event);
															handlerPalabrasNuevas(event);
															handlerCantidadNoVistasVistasPorIdioma(event);
															handlerCantidadAprendidasPorIdioma(event);
														}}
													>
														<option value="semana">Semanal</option>
														<option value="mes">Mensual</option>
													</select>
												</div>
											</Form.Group>
										</Col>
									</Row>
								</div>
								<br />
								<Row>
									<Col md={6}>
										<h4>Palabras repasadas</h4>
										{loadingPalabrasRepasadasIdioma ? (
											<Loader />
										) : (
											<div>{show && <MultiAxisLine data={dataPalabrasRepasadasPorIdioma} />}</div>
										)}
										<br />
										<h4>Palabras nuevas</h4>
										{loadingNuevasPorIdioma ? (
											<Loader />
										) : (
											<div>{show && <LineChart data={dataPalabrasNuevasPorIdioma} />}</div>
										)}
									</Col>
									<Col md={6}>
										<h4>Palabras No Vistas y Nuevas</h4>
										{loadingCantidadNoVistasVistasPorIdioma ? (
											<Loader />
										) : (
											<div data-tut="no-vistas-y-vistas">
												{show && <VerticalBar data={dataPabrasNoVistasVistas} />}
											</div>
										)}
										<br />
										<h4>Palabras aprendidas</h4>
										{loadingCantidadAprendidasPorIdioma ? (
											<Loader />
										) : (
											<div data-tut="palabras-aprendidas">
												{show && <LineChart data={dataPalabrasAprendidas} />}
											</div>
										)}
									</Col>
								</Row>
							</div>
						)}
					</Container>
					<Tour
						onRequestClose={() => setTour(false)}
						steps={tourConfig}
						isOpen={tour}
						rounded={5}
						accentColor="#5cb7b7"
					/>
				</div>
			) : null}
		</div>
	);
}

export default ProgresoScreen;
