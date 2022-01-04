import axios from "axios";
import {
	IDIOMAS_DETAILS_REQUEST,
	IDIOMAS_DETAILS_SUCCESS,
	IDIOMAS_DETAILS_FAIL,
	IDIOMAS_USER_DETAILS_REQUEST,
	IDIOMAS_USER_DETAILS_SUCCESS,
	IDIOMAS_USER_DETAILS_FAIL,
} from "../constants/idiomasConstants";

//-------------------------------------------------------------------------------
export const getIdiomas = () => async (dispatch) => {
	try {
		dispatch({ type: IDIOMAS_DETAILS_REQUEST });

		const config = {
			headers: {
				"Content-type": "application/json",
			},
		};

		const { data } = await axios.get(`/api/idiomas/`);

		dispatch({
			type: IDIOMAS_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: IDIOMAS_DETAILS_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};

export const getIdiomasUser = () => async (dispatch, getState) => {
	try {
		dispatch({ type: IDIOMAS_USER_DETAILS_REQUEST });

		const {
			userLogin: { userInfo },
		} = getState();
		const config = {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.get(`/api/idiomas/idiomasuser/`, config);

		dispatch({
			type: IDIOMAS_USER_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: IDIOMAS_USER_DETAILS_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};
