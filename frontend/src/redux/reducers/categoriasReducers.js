import {
	CATEGORIAS_DETAILS_REQUEST,
	CATEGORIAS_DETAILS_SUCCESS,
	CATEGORIAS_DETAILS_FAIL,
	CATEGORIA_REGISTER_REQUEST,
	CATEGORIA_REGISTER_SUCCESS,
	CATEGORIA_REGISTER_FAIL,
	CATEGORIA_REGISTER_RESET,
	CATEGORIA_DELETE_REQUEST,
	CATEGORIA_DELETE_SUCCESS,
	CATEGORIA_DELETE_FAIL,
	CATEGORIA_UPDATE_REQUEST,
	CATEGORIA_UPDATE_SUCCESS,
	CATEGORIA_UPDATE_FAIL,
} from "../constants/categoriaConstants";

export const categoriasReducer = (state = {}, action) => {
	switch (action.type) {
		case CATEGORIAS_DETAILS_REQUEST:
			return { loading: true, categoriasTotal: [] };

		case CATEGORIAS_DETAILS_SUCCESS:
			return {
				loading: false,
				success: true,
				categoriasTotal: action.payload,
			};

		case CATEGORIAS_DETAILS_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const categoriasRegisterReducer = (state = {}, action) => {
	switch (action.type) {
		case CATEGORIA_REGISTER_REQUEST:
			return { loading: true };

		case CATEGORIA_REGISTER_SUCCESS:
			return {
				loading: false,
				success: true,
				registerCategoriaInfo: action.payload,
			};

		case CATEGORIA_REGISTER_FAIL:
			return { loading: false, error: action.payload };

		case CATEGORIA_REGISTER_RESET:
			return {};

		default:
			return state;
	}
};

export const categoriasDeleteReducer = (state = {}, action) => {
	switch (action.type) {
		case CATEGORIA_DELETE_REQUEST:
			return { loading: true };

		case CATEGORIA_DELETE_SUCCESS:
			return { loading: false, success: true };

		case CATEGORIA_DELETE_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const categoriaUpdateReducer = (state = {}, action) => {
	switch (action.type) {
		case CATEGORIA_UPDATE_REQUEST:
			return { loading: true };

		case CATEGORIA_UPDATE_SUCCESS:
			return {
				loading: false,
				success: true,
				categoriaUpdate: action.payload,
			};

		case CATEGORIA_UPDATE_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};
