import axios from "axios";
import {
	USER_LOGIN_REQUEST,
	USER_LOGIN_SUCCESS,
	USER_LOGIN_FAIL,
	USER_LOGOUT,
	USER_REGISTER_REQUEST,
	USER_REGISTER_SUCCESS,
	USER_REGISTER_FAIL,
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

export const login = (email, password) => async (dispatch) => {
	try {
		dispatch({
			type: USER_LOGIN_REQUEST,
		});

		const config = {
			headers: {
				"Content-type": "application/json",
			},
		};

		const { data } = await axios.post(
			`/api/users/login/`,
			{ email: email, password: password },
			config
		);

		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: data,
		});

		localStorage.setItem("userInfo", JSON.stringify(data));
	} catch (error) {
		dispatch({
			type: USER_LOGIN_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};

export const logout = () => (dispatch) => {
	/* usamos el (dispach) para poder cambiar el estado */
	localStorage.removeItem("userInfo");
	dispatch({ type: USER_LOGOUT });
	dispatch({ type: USER_DETAILS_RESET });
};

export const registerUsuario =
	(
		name,
		email,
		usuario,
		password,
		pais,
		idioma,
		fechaNacimiento,
		sexo,
		apellido
	) =>
	async (dispatch) => {
		try {
			dispatch({
				type: USER_REGISTER_REQUEST,
			});

			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};
			//			`/api/users/register/`,
			//const nacimiento = `${fechaNacimiento.GetYear()}-${fechaNacimiento.GetMonth()}-${fechaNacimiento.GetDay()}`;
			var dt = new Date(fechaNacimiento);
			var month = dt.getMonth();
			var year = dt.getFullYear();
			var day = dt.getDay();
			var nacimiento = year + "-" + month + "-" + day;

			const { data } = await axios.post(
				`/auth/users/`,
				{
					username: usuario,
					email: email,
					password: password,
					re_password: password,
					sexo: sexo,
					fecha_nacimiento: nacimiento,
					idioma: idioma,
					first_name: name,
					last_name: apellido,
					pais: pais,
				},
				config
			);

			dispatch({
				type: USER_REGISTER_SUCCESS,
				payload: data,
			});

			//Para que no se autologee al registrarse, ya que tiene que activar la cuenta
			/* dispatch({
				type: USER_LOGIN_SUCCESS,
				payload: data,
			}); 

			localStorage.setItem("userInfo", JSON.stringify(data));*/
		} catch (error) {
			dispatch({
				type: USER_REGISTER_FAIL,
				payload:
					error.response && error.response.data
						? error.response.data
						: error.message,
			});
		}
	};

export const getUserDetails = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_DETAILS_REQUEST,
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

		const { data } = await axios.get(`/api/users/${id}/`, config);

		dispatch({
			type: USER_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: USER_DETAILS_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};

export const getPerfilInfo = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_INFO_REQUEST,
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

		const { data } = await axios.get(`/api/users/profile/`, config);

		dispatch({
			type: USER_INFO_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: USER_INFO_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};

export const getPerfilInfoEstadistica = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_INFO_ESTADISTICA_REQUEST,
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
			`/api/estadisticas/informacion/perfil/`,
			config
		);

		//console.log(data);
		dispatch({
			type: USER_INFO_ESTADISTICA_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: USER_INFO_ESTADISTICA_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_UPDATE_PROFILE_REQUEST,
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
			`/api/users/profile/update/`,
			user,
			config
		);

		dispatch({
			type: USER_UPDATE_PROFILE_SUCCESS,
			payload: data,
		});

		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: data,
		});

		localStorage.setItem("userInfo", JSON.stringify(data));
	} catch (error) {
		dispatch({
			type: USER_UPDATE_PROFILE_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};

export const resetPassword = (email) => async (dispatch, getState) => {
	try {
		dispatch({
			type: PASSWORD_RESET_REQUEST,
		});

		const config = {
			headers: {
				"Content-type": "application/json",
			},
		};

		const { data } = await axios.post(
			`/auth/users/reset_password/`,
			{
				email: email,
			},
			config
		);

		dispatch({
			type: PASSWORD_RESET_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: PASSWORD_RESET_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};

export const resetPasswordConfirm =
	(uid, token, new_password) => async (dispatch, getState) => {
		console.log(uid, token, new_password);

		try {
			dispatch({
				type: PASSWORD_RESET_CONFIRM_REQUEST,
			});

			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};

			const { data } = await axios.post(
				`/auth/users/reset_password_confirm/`,
				{
					uid: uid,
					token: token,
					new_password: new_password,
				},
				config
			);

			dispatch({
				type: PASSWORD_RESET_CONFIRM_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: PASSWORD_RESET_CONFIRM_FAIL,
				payload:
					error.response && error.response.data.detail
						? error.response.data.detail
						: error.message,
			});
		}
	};

export const activateAccount = (uid, token) => async (dispatch) => {
	console.log(uid, token);

	try {
		dispatch({
			type: ACTIVATE_ACCOUNT_CONFIRM_REQUEST,
		});

		const config = {
			headers: {
				"Content-type": "application/json",
			},
		};

		const { data } = await axios.post(
			`/auth/users/activation/`,
			{
				uid: uid,
				token: token,
			},
			config
		);

		dispatch({
			type: ACTIVATE_ACCOUNT_CONFIRM_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: ACTIVATE_ACCOUNT_CONFIRM_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};
