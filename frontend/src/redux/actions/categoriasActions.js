import axios from "axios";
import {
	CATEGORIAS_DETAILS_REQUEST,
	CATEGORIAS_DETAILS_SUCCESS,
	CATEGORIAS_DETAILS_FAIL,

	CATEGORIA_REGISTER_REQUEST,
	CATEGORIA_REGISTER_SUCCESS,
	CATEGORIA_REGISTER_FAIL,

	CATEGORIA_DELETE_REQUEST,
	CATEGORIA_DELETE_SUCCESS,
	CATEGORIA_DELETE_FAIL,

	CATEGORIA_UPDATE_REQUEST,
	CATEGORIA_UPDATE_SUCCESS,
	CATEGORIA_UPDATE_FAIL

} from "../constants/categoriaConstants";

//-------------------------------------------------------------------------------
export const getCategorias = () => async (dispatch, getState) => {
	try {
		dispatch({ type: CATEGORIAS_DETAILS_REQUEST });

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.get(`/api/categorias/`, config);

		dispatch({
			type: CATEGORIAS_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: CATEGORIAS_DETAILS_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};

export const registerCategoria = (nombre, description, userId) => async (dispatch, getState) => {

	try {
		dispatch({
			type: CATEGORIA_REGISTER_REQUEST,
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

		const { data } = await axios.post(
			`/api/categorias/crear/`,
			{
				usuario: userId,
				nombre: nombre,
				descripcion: description,
			},
			config
		);

		dispatch({
			type: CATEGORIA_REGISTER_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: CATEGORIA_REGISTER_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
}

export const deleteCategoria = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: CATEGORIA_DELETE_REQUEST
		})

		const {
			userLogin: { userInfo },
		} = getState()

		const config = {
			headers: {
				'Content-type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`
			}
		}

		const { data } = await axios.delete(`/api/categorias/delete/${id}/`, config)

		dispatch({
			type: CATEGORIA_DELETE_SUCCESS,
		})
		
	} catch (error) {
		dispatch({
			type: CATEGORIA_DELETE_FAIL,
			payload: error.response && error.response.data.detail
				? error.response.data.detail
				: error.message,
		})
	}
}

export const updateCategoria = (categoria) => async (dispatch, getState) => {
	try {
		dispatch({
			type: CATEGORIA_UPDATE_REQUEST
		})

		const {
			userLogin: { userInfo },
		} = getState()

		const config = {
			headers: {
				'Content-type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`
			}
		}

		const { data } = await axios.put(`/api/categorias/update/${categoria.id}/`,
			{
				nombre: categoria.nombre,
				descripcion: categoria.descripcion,			
			},
			config
		)
		dispatch({
			type: CATEGORIA_UPDATE_SUCCESS,
			payload: data,
		})

	} catch (error) {
		dispatch({
			type: CATEGORIA_UPDATE_FAIL,
			payload: error.response && error.response.data.detail
				? error.response.data.detail
				: error.message,
		})
	}
}
