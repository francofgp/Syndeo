import {
	USER_LOGIN_REQUEST,
	USER_LOGIN_SUCCESS,
	USER_LOGIN_FAIL,
	USER_REGISTER_REQUEST,
	USER_REGISTER_SUCCESS,
	USER_REGISTER_FAIL,
	USER_REGISTER_RESET,
	USER_LOGOUT,
	USER_DETAILS_REQUEST,
	USER_DETAILS_SUCCESS,
	USER_DETAILS_FAIL,
	USER_DETAILS_RESET,
	USER_UPDATE_PROFILE_REQUEST,
	USER_UPDATE_PROFILE_SUCCESS,
	USER_UPDATE_PROFILE_FAIL,
	USER_UPDATE_PROFILE_RESET,
	USER_INFO_REQUEST,
	USER_INFO_SUCCESS,
	USER_INFO_FAIL,
	USER_INFO_RESET,
	USER_INFO_ESTADISTICA_REQUEST,
	USER_INFO_ESTADISTICA_SUCCESS,
	USER_INFO_ESTADISTICA_FAIL,
	USER_INFO_ESTADISTICA_RESET,
	PASSWORD_RESET_REQUEST,
	PASSWORD_RESET_SUCCESS,
	PASSWORD_RESET_FAIL,
	PASSWORD_RESET_RESET,
	PASSWORD_RESET_CONFIRM_REQUEST,
	PASSWORD_RESET_CONFIRM_SUCCESS,
	PASSWORD_RESET_CONFIRM_FAIL,
	PASSWORD_RESET_CONFIRM_RESET,
	ACTIVATE_ACCOUNT_CONFIRM_REQUEST,
	ACTIVATE_ACCOUNT_CONFIRM_SUCCESS,
	ACTIVATE_ACCOUNT_CONFIRM_FAIL,
	ACTIVATE_ACCOUNT_CONFIRM_RESET,
} from "../constants/userConstants";

export const userLoginReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_LOGIN_REQUEST:
			return { loading: true };

		case USER_LOGIN_SUCCESS:
			return { loading: false, userInfo: action.payload };

		case USER_LOGIN_FAIL:
			return { loading: false, error: action.payload };

		case USER_LOGOUT:
			return {};
		default:
			return state;
	}
};

export const userRegisterReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_REGISTER_REQUEST:
			return { loading: true };

		case USER_REGISTER_SUCCESS:
			return { success: true, loading: false, userInfo: action.payload };

		case USER_REGISTER_FAIL:
			return { loading: false, error: action.payload };

		case USER_LOGOUT:
			return {};

		case USER_REGISTER_RESET:
			return {};
		default:
			return state;
	}
};

export const userDetailsReducer = (state = { user: {} }, action) => {
	switch (action.type) {
		case USER_DETAILS_REQUEST:
			return { ...state, loading: true };

		case USER_DETAILS_SUCCESS:
			return { loading: false, user: action.payload };

		case USER_DETAILS_FAIL:
			return { loading: false, error: action.payload };

		case USER_DETAILS_RESET:
			return { user: {} };

		default:
			return state;
	}
};

export const userUpdateProfileReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_UPDATE_PROFILE_REQUEST:
			return { loading: true };

		case USER_UPDATE_PROFILE_SUCCESS:
			return { loading: false, success: true, userInfo: action.payload };

		case USER_UPDATE_PROFILE_FAIL:
			return { loading: false, error: action.payload };

		case USER_UPDATE_PROFILE_RESET:
			return {};

		default:
			return state;
	}
};

export const userInfoReducer = (state = { user: {} }, action) => {
	switch (action.type) {
		case USER_INFO_REQUEST:
			return { loading: true };

		case USER_INFO_SUCCESS:
			return { loading: false, success: true, user: action.payload };

		case USER_INFO_FAIL:
			return { loading: false, error: action.payload };

		case USER_INFO_RESET:
			return {};

		default:
			return state;
	}
};

export const perfilInfoEstadisticaReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_INFO_ESTADISTICA_REQUEST:
			return { ...state, loading: true };

		case USER_INFO_ESTADISTICA_SUCCESS:
			return {
				loading: false,
				success: true,
				userInfoEstadistica: action.payload,
			};

		case USER_INFO_ESTADISTICA_FAIL:
			return { loading: false, error: action.payload };

		case USER_INFO_ESTADISTICA_RESET:
			return {};

		default:
			return state;
	}
};

export const resetPasswordReducer = (state = {}, action) => {
	switch (action.type) {
		case PASSWORD_RESET_REQUEST:
			return { loading: true };

		case PASSWORD_RESET_SUCCESS:
			return { loading: false, success: true, data: action.payload };

		case PASSWORD_RESET_FAIL:
			return { loading: false, error: action.payload };

		case PASSWORD_RESET_RESET:
			return {};

		default:
			return state;
	}
};

export const resetPasswordConfirmReducer = (state = {}, action) => {
	switch (action.type) {
		case PASSWORD_RESET_CONFIRM_REQUEST:
			return { loading: true };

		case PASSWORD_RESET_CONFIRM_SUCCESS:
			return { loading: false, success: true, data: action.payload };

		case PASSWORD_RESET_CONFIRM_FAIL:
			return { loading: false, error: action.payload };

		case PASSWORD_RESET_CONFIRM_RESET:
			return {};

		default:
			return state;
	}
};

export const activateAccountReducer = (state = {}, action) => {
	switch (action.type) {
		case ACTIVATE_ACCOUNT_CONFIRM_REQUEST:
			return { loading: true };

		case ACTIVATE_ACCOUNT_CONFIRM_SUCCESS:
			console.log(action.payload);

			return {
				loading: false,
				success: true /* , data: action.payload */,
			};
		case ACTIVATE_ACCOUNT_CONFIRM_FAIL:
			return { loading: false, error: action.payload };

		case ACTIVATE_ACCOUNT_CONFIRM_RESET:
			return {};

		default:
			return state;
	}
};
