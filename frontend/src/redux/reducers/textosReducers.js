import {
	TEXTO_REGISTER_REQUEST,
	TEXTO_REGISTER_SUCCESS,
	TEXTO_REGISTER_FAIL,

	TEXTO_REGISTER_RESET,
	TEXTO_UPDATE_REQUEST,
	TEXTO_UPDATE_SUCCESS,
	TEXTO_UPDATE_FAIL,
	TEXTO_UPDATE_RESET,

	TEXTO_DETAILS_REQUEST,
	TEXTO_DETAILS_SUCCESS,
	TEXTO_DETAILS_FAIL,
	TEXTO_DETAILS_RESET,

	TEXTOS_DETAILS_REQUEST,
	TEXTOS_DETAILS_SUCCESS,
	TEXTOS_DETAILS_FAIL,

	TEXTO_DELETE_REQUEST,
	TEXTO_DELETE_SUCCESS,
	TEXTO_DELETE_FAIL,

	TEXTO_FECHA_ULTIMA_LECTURA_REQUEST,
	TEXTO_FECHA_ULTIMA_LECTURA_SUCCESS,
	TEXTO_FECHA_ULTIMA_LECTURA_FAIL,

	TEXTO_MARCAR_COMO_LEIDO_REQUEST,
	TEXTO_MARCAR_COMO_LEIDO_SUCCESS,
	TEXTO_MARCAR_COMO_LEIDO_FAIL,
	
	TEXTO_CHECK_REQUEST,
	TEXTO_CHECK_SUCCESS,
	TEXTO_CHECK_FAIL,
	TEXTO_CHECK_RESET,

} from "../constants/textosConstans";

export const textoRegisterReducer = (state = {}, action) => {
	switch (action.type) {
		case TEXTO_REGISTER_REQUEST:
			return { loading: true };

		case TEXTO_REGISTER_SUCCESS:
			return { loading: false, success: true, textoInfo: action.payload };

		case TEXTO_REGISTER_FAIL:
			return { loading: false, error: action.payload };
		case TEXTO_REGISTER_RESET:
			return {};

		default:
			return state;
	}
};

export const textoUpdateReducer = (state = {}, action) => {
	switch (action.type) {
		case TEXTO_UPDATE_REQUEST:
			return { loading: true };

		case TEXTO_UPDATE_SUCCESS:
			return { loading: false, success: true, texto: action.payload };

		case TEXTO_UPDATE_FAIL:
			return { loading: false, error: action.payload };

		case TEXTO_UPDATE_RESET:
			return {};
		default:
			return state;
	}
};

export const textoDetailsReducer = (state = { textoInfo: [] }, action) => {
	switch (action.type) {
		case TEXTO_DETAILS_REQUEST:
			return { loading: true, ...state };

		case TEXTO_DETAILS_SUCCESS:
			return { loading: false, success: true, textoInfo: action.payload };

		case TEXTO_DETAILS_FAIL:
			return { loading: false, error: action.payload };

		case TEXTO_DETAILS_RESET:
			return {}

		default:
			return state;
	}
};

export const textosDetailsReducer = (state = { textos: [] }, action) => {
	switch (action.type) {
		case TEXTOS_DETAILS_REQUEST:
			return { loading: true, textos: [] };

		case TEXTOS_DETAILS_SUCCESS:
			return { loading: false, textos: action.payload };

		case TEXTOS_DETAILS_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const textoDeleteReducer = (state = {}, action) => {
	switch (action.type) {
		case TEXTO_DELETE_REQUEST:
			return { loading: true };

		case TEXTO_DELETE_SUCCESS:
			return { loading: false, success: true };

		case TEXTO_DELETE_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const fechaUltimaLecturaReducer = (state = {}, action) => {
	switch (action.type) {
		case TEXTO_FECHA_ULTIMA_LECTURA_REQUEST:
			return { loading: true }

		case TEXTO_FECHA_ULTIMA_LECTURA_SUCCESS:
			return { loading: false, success: true }

		case TEXTO_FECHA_ULTIMA_LECTURA_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}

export const marcarComoLeidoReducer = (state = {}, action) => {
	switch (action.type) {
		case TEXTO_MARCAR_COMO_LEIDO_REQUEST:
			return { loading: true }

		case TEXTO_MARCAR_COMO_LEIDO_SUCCESS:
			return { loading: false, success: true, data: action.payload }

		case TEXTO_MARCAR_COMO_LEIDO_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}

export const checkTextoReducer = (state = {}, action) => {
	switch (action.type) {
		case TEXTO_CHECK_REQUEST:
			return { loading: true }

		case TEXTO_CHECK_SUCCESS:
			return { loading: false, success: true, data: action.payload }

		case TEXTO_CHECK_FAIL:
			return { loading: false, error: action.payload }
		
		case TEXTO_CHECK_RESET:
			return {}

		default:
			return state
	}
}