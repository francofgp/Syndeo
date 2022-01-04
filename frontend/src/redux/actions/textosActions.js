import axios from "axios";
import {
	TEXTO_REGISTER_REQUEST,
	TEXTO_REGISTER_SUCCESS,
	TEXTO_REGISTER_FAIL,
	TEXTO_UPDATE_REQUEST,
	TEXTO_UPDATE_SUCCESS,
	TEXTO_UPDATE_FAIL,
	TEXTO_UPDATE_RESET,
	TEXTO_DETAILS_REQUEST,
	TEXTO_DETAILS_SUCCESS,
	TEXTO_DETAILS_FAIL,
	TEXTOS_DETAILS_REQUEST,
	TEXTOS_DETAILS_SUCCESS,
	TEXTOS_DETAILS_FAIL,
	TEXTO_DELETE_REQUEST,
	TEXTO_DELETE_SUCCESS,
	TEXTO_DELETE_FAIL,
	TEXTO_FECHA_ULTIMA_LECTURA_REQUEST,
	TEXTO_FECHA_ULTIMA_LECTURA_SUCCESS,
	TEXTO_FECHA_ULTIMA_LECTURA_FAIL,
	TEXTO_CHECK_REQUEST,
	TEXTO_CHECK_SUCCESS,
	TEXTO_CHECK_FAIL,
	TEXTO_CHECK_RESET,
} from "../constants/textosConstans";

export const registerTexto =
	(
		image,
		texto,
		fecha,
		usuario,
		name,
		categoria,
		longitud,
		audio,
		idioma,
		youtube,
		checkBoxAI,
		autor
	) =>
	async (dispatch, getState) => {
		try {
			dispatch({
				type: TEXTO_REGISTER_REQUEST,
			});

			let form_data = new FormData();
			form_data.append("image", image);
			form_data.append("texto", texto);
			form_data.append("fechaCreacion", fecha);
			form_data.append("usuario", usuario);
			form_data.append("nombre", name);
			form_data.append("fechaModificacion", fecha);
			form_data.append("categoria", categoria);
			form_data.append("cantidadPalabras", longitud);
			form_data.append("audio", audio);
			form_data.append("idioma", idioma);
			form_data.append("youtubeURL", youtube);
			form_data.append("checkBoxAI", checkBoxAI);
			form_data.append("autor", autor);

			const {
				userLogin: { userInfo },
			} = getState();

			const config = {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${userInfo.token}`,
				},
			};

			const { data } = await axios.post(
				`/api/textos/crear/`,
				form_data,
				config
			);

			dispatch({
				type: TEXTO_REGISTER_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: TEXTO_REGISTER_FAIL,
				payload:
					error.response && error.response.data.detail
						? error.response.data.detail
						: error.message,
			});
		}
	};

export const getTextosDetails = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: TEXTOS_DETAILS_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.get(`/api/textos/user/${id}/`, config);

		dispatch({
			type: TEXTOS_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: TEXTOS_DETAILS_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};

export const getTextosQuery = (query) => async (dispatch, getState) => {
	try {
		dispatch({
			type: TEXTOS_DETAILS_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.get(
			`/api/textos/user/busqueda/?query=${query}`,
			config
		);

		dispatch({
			type: TEXTOS_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: TEXTOS_DETAILS_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};

export const getTextoDetails = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: TEXTO_DETAILS_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.get(`/api/textos/mejorado/${id}/`, config);

		dispatch({
			type: TEXTO_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: TEXTO_DETAILS_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};

export const updateTexto =
	(
		id,
		image,
		texto,
		nombre,
		categoria,
		audio,
		idioma,
		youtubeURL,
		checkBoxAI,
		autor
	) =>
	async (dispatch, getState) => {
		try {
			dispatch({
				type: TEXTO_UPDATE_REQUEST,
			});

			const {
				userLogin: { userInfo },
			} = getState();

			let form_data = new FormData();
			form_data.append("image", image);
			form_data.append("texto", texto);
			form_data.append("nombre", nombre);
			form_data.append("categoria", categoria);
			form_data.append("audio", audio);
			form_data.append("idioma", idioma);
			form_data.append("youtubeURL", youtubeURL);
			form_data.append("checkBoxAI", checkBoxAI);
			form_data.append("autor", autor);

			const config = {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${userInfo.token}`,
				},
			};

			const { data } = await axios.put(
				`/api/textos/update/${id}/`,
				form_data,
				config
			);

			dispatch({
				type: TEXTO_UPDATE_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: TEXTO_UPDATE_FAIL,
				payload:
					error.response && error.response.data.detail
						? error.response.data.detail
						: error.message,
			});
		}
	};

export const deleteTexto = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: TEXTO_DELETE_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.delete(
			`/api/textos/delete/${id}/`,
			config
		);

		dispatch({
			type: TEXTO_DELETE_SUCCESS,
		});
	} catch (error) {
		dispatch({
			type: TEXTO_DELETE_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};

export const setFechaUltimaLectura = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: TEXTO_FECHA_ULTIMA_LECTURA_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.put(
			`/api/textos/setFechaUltimaLectura/${id}`,
			{},
			config
		);
		dispatch({
			type: TEXTO_FECHA_ULTIMA_LECTURA_SUCCESS,
		});
	} catch (error) {
		dispatch({
			type: TEXTO_FECHA_ULTIMA_LECTURA_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};

export const marcarComoLeido = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: TEXTO_FECHA_ULTIMA_LECTURA_REQUEST,
		});
		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.put(
			`/api/textos/marcarComoLeido/${id}`,
			{},
			config
		);

		dispatch({
			type: TEXTO_FECHA_ULTIMA_LECTURA_SUCCESS,
		});
	} catch (error) {
		dispatch({
			type: TEXTO_FECHA_ULTIMA_LECTURA_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};

export const checkTexto = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: TEXTO_CHECK_REQUEST,
		});
		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.get(
			`/api/textos/checkTexto/?textoID=${id}&userID=${userInfo.id}`,
			config
		);

		dispatch({
			type: TEXTO_CHECK_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: TEXTO_CHECK_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};
