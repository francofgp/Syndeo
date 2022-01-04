import axios from "axios";
import {
    META_DIARIA_DETAIL_REQUEST,
    META_DIARIA_DETAIL_SUCCESS,
    META_DIARIA_DETAIL_FAIL,
    META_DIARIA_DETAIL_RESET,

    CANTIDAD_PALABRAS_REPASADAS_DETAIL_REQUEST,
    CANTIDAD_PALABRAS_REPASADAS_DETAIL_SUCCESS,
    CANTIDAD_PALABRAS_REPASADAS_DETAIL_FAIL,
    CANTIDAD_PALABRAS_REPASADAS_DETAIL_RESET,

    CANTIDAD_PALABRAS_NUEVAS_DETAIL_REQUEST,
    CANTIDAD_PALABRAS_NUEVAS_DETAIL_SUCCESS,
    CANTIDAD_PALABRAS_NUEVAS_DETAIL_FAIL,
    CANTIDAD_PALABRAS_NUEVAS_DETAIL_RESET,

    CANTIDAD_DIFICULTAD_DETAIL_REQUEST,
    CANTIDAD_DIFICULTAD_DETAIL_SUCCESS,
    CANTIDAD_DIFICULTAD_DETAIL_FAIL,
    CANTIDAD_DIFICULTAD_DETAIL_RESET,

    CANTIDAD_PALABRAS_REPASADAS_IDIOMAS_REQUEST,
    CANTIDAD_PALABRAS_REPASADAS_IDIOMAS_SUCCESS,
    CANTIDAD_PALABRAS_REPASADAS_IDIOMAS_FAIL,
    CANTIDAD_PALABRAS_REPASADAS_IDIOMAS_RESET,

    CANTIDAD_PALABRAS_NUEVAS_IDIOMAS_REQUEST,
    CANTIDAD_PALABRAS_NUEVAS_IDIOMAS_SUCCESS,
    CANTIDAD_PALABRAS_NUEVAS_IDIOMAS_FAIL,
    CANTIDAD_PALABRAS_NUEVAS_IDIOMAS_RESET,

    CANTIDAD_PALABRAS_VISTAS_NO_VISTAS_REQUEST,
    CANTIDAD_PALABRAS_VISTAS_NO_VISTAS_SUCCESS,
    CANTIDAD_PALABRAS_VISTAS_NO_VISTAS_FAIL,
    CANTIDAD_PALABRAS_VISTAS_NO_VISTAS_RESET,

    CANTIDAD_PALABRAS_APRENDIDAS_REQUEST,
    CANTIDAD_PALABRAS_APRENDIDAS_SUCCESS,
    CANTIDAD_PALABRAS_APRENDIDAS_FAIL,
    CANTIDAD_PALABRAS_APRENDIDAS_RESET,

} from "../constants/progresoConstants"

export const getMetaDiaria = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: META_DIARIA_DETAIL_REQUEST,
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

        const { data } = await axios.get(`/api/estadisticas/cantidad/meta/diaria/`, config);

        dispatch({
            type: META_DIARIA_DETAIL_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: META_DIARIA_DETAIL_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

export const cantidadPalabrasRepasadas = (periodo) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CANTIDAD_PALABRAS_REPASADAS_DETAIL_REQUEST,
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

        const { data } = await axios.get(`/api/estadisticas/cantidad/repasadas/${periodo}/`, config);

        dispatch({
            type: CANTIDAD_PALABRAS_REPASADAS_DETAIL_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: CANTIDAD_PALABRAS_REPASADAS_DETAIL_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

export const cantidadPalabrasNuevas = (periodo) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CANTIDAD_PALABRAS_NUEVAS_DETAIL_REQUEST,
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

        const { data } = await axios.get(`/api/estadisticas/cantidad/nuevas/${periodo}/`, config);

        dispatch({
            type: CANTIDAD_PALABRAS_NUEVAS_DETAIL_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: CANTIDAD_PALABRAS_NUEVAS_DETAIL_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

export const cantidadDificultad = (idioma) => async (dispatch, getState) => {

    try {

        dispatch({
            type: CANTIDAD_DIFICULTAD_DETAIL_REQUEST,
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

        const { data } = await axios.get(`/api/estadisticas/cantidad/dificultad/${idioma !== "" ? `idioma/?idiomaId=${idioma}` : ``}`, config);

        dispatch({
            type: CANTIDAD_DIFICULTAD_DETAIL_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: CANTIDAD_DIFICULTAD_DETAIL_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

export const cantidadPalabrasRepasadasIdioma = (idioma, periodo) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CANTIDAD_PALABRAS_REPASADAS_IDIOMAS_REQUEST,
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

        const { data } = await axios.get(`/api/estadisticas/cantidad/repasadas/${periodo}/idioma/?idiomaId=${idioma}`, config);

        dispatch({
            type: CANTIDAD_PALABRAS_REPASADAS_IDIOMAS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: CANTIDAD_PALABRAS_REPASADAS_IDIOMAS_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

export const cantidadNuevasPorIdioma = (idioma, periodo) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CANTIDAD_PALABRAS_NUEVAS_IDIOMAS_REQUEST,
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

        const { data } = await axios.get(`/api/estadisticas/cantidad/nuevas/${periodo}/idioma/?idiomaId=${idioma}`, config);

        dispatch({
            type: CANTIDAD_PALABRAS_NUEVAS_IDIOMAS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: CANTIDAD_PALABRAS_NUEVAS_IDIOMAS_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

export const cantidadNoVistasVistasPorIdioma = (idioma, periodo) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CANTIDAD_PALABRAS_VISTAS_NO_VISTAS_REQUEST,
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

        const { data } = await axios.get(`/api/estadisticas/cantidad/dificultad/noVistasVistas/idioma/?idiomaId=${idioma}`, config);

        dispatch({
            type: CANTIDAD_PALABRAS_VISTAS_NO_VISTAS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: CANTIDAD_PALABRAS_VISTAS_NO_VISTAS_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

export const cantidadAprendidasPorIdioma = (idioma, periodo) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CANTIDAD_PALABRAS_APRENDIDAS_REQUEST,
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

        const { data } = await axios.get(`/api/estadisticas/cantidad/aprendidas/${periodo}/idioma/?idiomaId=${idioma}`, config);

        dispatch({
            type: CANTIDAD_PALABRAS_APRENDIDAS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: CANTIDAD_PALABRAS_APRENDIDAS_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};
