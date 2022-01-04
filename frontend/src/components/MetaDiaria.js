import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import Swal from "sweetalert2";
import useWindowSize from "../Utils/UseWindowSize";
//import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import imagenTrofeo from "../data/imagenMetaDiaria/trofeoMetaDiaria.jpg";
import { getMetaDiaria } from "../redux/actions/progresoActions";

function MetaDiaria() {
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const metaDiariaRedux = useSelector((state) => state.progresoMetaDiaria);
	const { success, estadistica } = metaDiariaRedux;

	//Para saber si logró la meta diaria
	const [metaDiaria, setMetaDiaria] = useState({});
	const [esMeta, setEsMeta] = useState(false);
	const [gravity, setGravity] = useState(0.1);
	const [recycle, setRecycle] = useState(true);

	const dispatch = useDispatch();

	const { width, height } = useWindowSize();

	useEffect(() => {
		if (userInfo) {
			//getMetaDiaria();
			if (success) {
				//setMetaDiaria(estadistica.estadistica);
				lanzarCartel(estadistica.estadistica);
			} else if (!success) {
				dispatch(getMetaDiaria());
			}
		}
	}, [dispatch, success, userInfo]);

	const lanzarCartel = (stats) => {
		if (stats[2].esMeta) {
			const ultimaFechaMetaDiaria = localStorage.getItem(
				"ultimaFechaMetaDiaria"
			)
				? JSON.parse(localStorage.getItem("ultimaFechaMetaDiaria"))
				: null;

			if (
				ultimaFechaMetaDiaria === null ||
				ultimaFechaMetaDiaria.ultimaFechaMetaDiaria !==
					new Date().toJSON().split("T")[0]
			) {
				setEsMeta(true);
				const swalWithBootstrapButtons = Swal.mixin({
					customClass: {
						confirmButton: "btn btn-success",
					},
					buttonsStyling: false,
				});
				swalWithBootstrapButtons
					.fire({
						imageUrl: imagenTrofeo,
						//"https://img.freepik.com/free-vector/gold-trophy-with-name-plate-winner-competition_68708-545.jpg?size=338&ext=jpg",
						imageHeight: 338,
						imageAlt: "Fallo al cargar la imagen",
						title: "Cumpliste con tu meta diaria 🥳",
					})
					.then((e) => {
						localStorage.setItem(
							"ultimaFechaMetaDiaria",
							JSON.stringify({
								ultimaFechaMetaDiaria: new Date()
									.toJSON()
									.split("T")[0],
							})
						);
						setGravity(-0.5);
						setRecycle(false);
						setTimeout((e) => {
							setEsMeta(false);
						}, 2000);
					});
			} else {
				setEsMeta(false);
			}
		}
	};

	/*
	async function getMetaDiaria() {
		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};
		const { data } = await axios.get(
			`/api/estadisticas/cantidad/meta/diaria/`,
			config
		);
		setMetaDiaria(data.estadistica);
		lanzarCartel(data.estadistica);
	}
*/
	return (
		<div>
			{esMeta && (
				<Confetti
					width={width}
					height={height}
					gravity={gravity}
					recycle={recycle}
				/>
			)}
		</div>
	);
}

export default MetaDiaria;
