import axios from "axios";
import {
	PALABRAS_DETAILS_REQUEST,
	PALABRAS_DETAILS_SUCCESS,
	PALABRAS_DETAILS_FAIL,

	PALABRA_UPDATE_REQUEST,
	PALABRA_UPDATE_SUCCESS,
	PALABRA_UPDATE_FAIL,

	PALABRAS_UPDATE_REPASAR_REQUEST,
	PALABRAS_UPDATE_REPASAR_SUCCESS,
	PALABRAS_UPDATE_REPASAR_FAIL,

	PALABRAS_REPASAR_REQUEST,
	PALABRAS_REPASAR_SUCCESS,
	PALABRAS_REPASAR_FAIL,

	PALABRA_TRADUCCION_REQUEST,
	PALABRA_TRADUCCION_SUCCESS,
	PALABRA_TRADUCCION_FAIL,

	PALABRAS_UPDATE_DIFICULTAD_REQUEST,
	PALABRAS_UPDATE_DIFICULTAD_SUCCESS,
	PALABRAS_UPDATE_DIFICULTAD_FAIL,
	PALABRAS_UPDATE_DIFICULTAD_RESET,

	PALABRAS_UPDATE_FRASE_REQUEST,
	PALABRAS_UPDATE_FRASE_SUCCESS,
	PALABRAS_UPDATE_FRASE_FAIL,
	PALABRAS_UPDATE_FRASE_RESET,

} from "../constants/palabrasConstants";

export const getPalabras = () => async (dispatch, getState) => {
	try {
		dispatch({ type: PALABRAS_DETAILS_REQUEST });

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
			`/api/palabras/user/${userInfo.id}/`,
			config
		);

		dispatch({
			type: PALABRAS_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: PALABRAS_DETAILS_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};

export const updatePalabra = (palabra) => async (dispatch, getState) => {
	try {
		dispatch({
			type: PALABRA_UPDATE_REQUEST,
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

		const { data } = await axios.put(
			`/api/palabras/update/${palabra.id}/`,
			{
				traduccion: palabra.traduccion,
				dificultad: palabra.dificultad,
			},
			config
		);
		dispatch({
			type: PALABRA_UPDATE_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: PALABRA_UPDATE_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};

export const getPalabrasPDF = (idiomaId, dificultad) => async (dispatch, getState) => {
	try {
		dispatch({ type: PALABRAS_DETAILS_REQUEST });

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
			`/api/palabras/exportar/pdf/?idioma=${idiomaId}&dificultad=${parseInt(
				dificultad
			)}`,
			config
		);

		dispatch({
			type: PALABRAS_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: PALABRAS_DETAILS_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};

export const actualizarPalabrasARepasar = (palabrasAActualizar) => async (dispatch, getState) => {

	try {
		dispatch({ type: PALABRAS_UPDATE_REPASAR_REQUEST });

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};
		const { data } = await axios.put(
			`/api/palabras/repasar/actualizar/`,
			palabrasAActualizar,
			config
		);

		dispatch({
			type: PALABRAS_UPDATE_REPASAR_SUCCESS,
			payload: data,
		});


	} catch (error) {
		dispatch({
			type: PALABRAS_UPDATE_REPASAR_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}

}

export const palabrasARepasar = (idiomaId, cantidad, orden) => async (dispatch, getState) => {
	try {
		dispatch({ type: PALABRAS_REPASAR_REQUEST });

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
			`/api/palabras/repasar/?cantidad=${cantidad}&idioma=${idiomaId}&orden=${orden}`,
			config
		)

		dispatch({
			type: PALABRAS_REPASAR_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: PALABRAS_REPASAR_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};

export const traduccionPalabra = (idioma, seleccion) => async (dispatch, getState) => {

	try {
		dispatch({ type: PALABRA_TRADUCCION_REQUEST });

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.get(`/api/textos/traducir/?from=${idioma}&to=${userInfo.idioma}&texto=${seleccion}`,
			config
		);

		dispatch({
			type: PALABRA_TRADUCCION_SUCCESS,
			payload: data,
		});

	} catch (error) {
		dispatch({
			type: PALABRA_TRADUCCION_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
}

export const actualizarDificultadPalabra = (id, dificultad, traduccion, frase) => async (dispatch, getState) => {

	try {
		dispatch({ type: PALABRAS_UPDATE_DIFICULTAD_REQUEST });

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};
 
		const { data } = await axios.put(`/api/palabras/update/${id}/`,
			{
				dificultad: dificultad,
				traduccion: traduccion,
				frase: frase,
			},
			config
		);

		dispatch({
			type: PALABRAS_UPDATE_DIFICULTAD_SUCCESS,
			payload: data,
		});

	} catch (error) {
		dispatch({
			type: PALABRAS_UPDATE_DIFICULTAD_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
}

export const actualizarDificultadFrase = (dificultad, traduccion, frase, textoId, idioma) => async (dispatch, getState) => {

	try {
		dispatch({ type: PALABRAS_UPDATE_FRASE_REQUEST });

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.put(
			`/api/palabras/updatefrase/`,
			{
				dificultad: dificultad,
				traduccion: traduccion,
				frase: frase,
				texto: textoId,
				idioma: idioma,
				usuario: userInfo.id,
			},
			config
		);

		dispatch({
			type: PALABRAS_UPDATE_FRASE_SUCCESS,
			payload: data,
		});

	} catch (error) {
		dispatch({
			type: PALABRAS_UPDATE_FRASE_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
}