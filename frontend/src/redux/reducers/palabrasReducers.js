import {
  PALABRAS_DETAILS_REQUEST,
  PALABRAS_DETAILS_SUCCESS,
  PALABRAS_DETAILS_FAIL,
  PALABRAS_DETAILS_RESET,

  PALABRA_UPDATE_REQUEST,
  PALABRA_UPDATE_SUCCESS,
  PALABRA_UPDATE_FAIL,

  PALABRAS_UPDATE_REPASAR_REQUEST,
  PALABRAS_UPDATE_REPASAR_SUCCESS,
  PALABRAS_UPDATE_REPASAR_FAIL,
  PALABRAS_UPDATE_REPASAR_RESET,

  PALABRAS_REPASAR_REQUEST,
  PALABRAS_REPASAR_SUCCESS,
  PALABRAS_REPASAR_FAIL,
  PALABRAS_REPASAR_RESET,

  PALABRA_TRADUCCION_REQUEST,
  PALABRA_TRADUCCION_SUCCESS,
  PALABRA_TRADUCCION_FAIL,
  PALABRA_TRADUCCION_RESET,

  PALABRAS_UPDATE_DIFICULTAD_REQUEST,
  PALABRAS_UPDATE_DIFICULTAD_SUCCESS,
  PALABRAS_UPDATE_DIFICULTAD_FAIL,
  PALABRAS_UPDATE_DIFICULTAD_RESET,

  PALABRAS_UPDATE_FRASE_REQUEST,
  PALABRAS_UPDATE_FRASE_SUCCESS,
  PALABRAS_UPDATE_FRASE_FAIL,
  PALABRAS_UPDATE_FRASE_RESET,


} from "../constants/palabrasConstants";

export const palabrasDetailsReducer = (state = { palabras: [] }, action) => {
  switch (action.type) {
    case PALABRAS_DETAILS_REQUEST:
      return { loading: true, palabras: [] };

    case PALABRAS_DETAILS_SUCCESS:
      return { loading: false, success: true, palabras: action.payload };

    case PALABRAS_DETAILS_FAIL:
      return { loading: false, error: action.payload };

    case PALABRAS_DETAILS_RESET:
      return { palabras: [] }

    default:
      return state;
  }
};

export const palabraUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case PALABRA_UPDATE_REQUEST:
      return { loading: true }

    case PALABRA_UPDATE_SUCCESS:
      return { loading: false, success: true, palabraUpdate: action.payload }

    case PALABRA_UPDATE_FAIL:
      return { loading: false, error: action.payload }

    default:
      return state
  }
}

export const actualizarPalabrasARepasarReducer = (state = {}, action) => {
  switch (action.type) {
    case PALABRAS_UPDATE_REPASAR_REQUEST:
      return { loading: true }

    case PALABRAS_UPDATE_REPASAR_SUCCESS:
      return { loading: false, success: true, actualizarPalabrasARepasar: action.payload }

    case PALABRAS_UPDATE_REPASAR_FAIL:
      return { loading: false, error: action.payload }

    case PALABRAS_UPDATE_REPASAR_RESET:
      return {}

    default:
      return state
  }
}

export const palabrasARepasarReducer = (state = { palabras: [] }, action) => {
  switch (action.type) {
    case PALABRAS_REPASAR_REQUEST:
      return { loading: true, palabras: [] };

    case PALABRAS_REPASAR_SUCCESS:
      return { loading: false, success: true, palabras: action.payload };

    case PALABRAS_REPASAR_FAIL:
      return { loading: false, success: false, error: action.payload, palabras: [] };

    case PALABRAS_REPASAR_RESET:
      return { palabras: [] }

    default:
      return state;
  }
};

export const traduccionPalabraReducer = (state = {}, action) => {
  switch (action.type) {
    case PALABRA_TRADUCCION_REQUEST:
      return { loading: true };

    case PALABRA_TRADUCCION_SUCCESS:
      return { loading: false, success: true, traduccion: action.payload };

    case PALABRA_TRADUCCION_FAIL:
      return { loading: false, error: action.payload };

    case PALABRA_TRADUCCION_RESET:
      return {}

    default:
      return state;
  }
};

export const actualizarPalabraDificultadReducer = (state = {}, action) => {
  switch (action.type) {
    case PALABRAS_UPDATE_DIFICULTAD_REQUEST:
      return { loading: true };

    case PALABRAS_UPDATE_DIFICULTAD_SUCCESS:
      return { loading: false, success: true, data: action.payload };

    case PALABRAS_UPDATE_DIFICULTAD_FAIL:
      return { loading: false, error: action.payload };

    case PALABRAS_UPDATE_DIFICULTAD_RESET:
      return {}

    default:
      return state;
  }
};

export const actualizarFraseDificultadReducer = (state = {}, action) => {
  switch (action.type) {
    case PALABRAS_UPDATE_FRASE_REQUEST:
      return { loading: true };

    case PALABRAS_UPDATE_FRASE_SUCCESS:
      return { loading: false, success: true, data: action.payload };

    case PALABRAS_UPDATE_FRASE_FAIL:
      return { loading: false, error: action.payload };

    case PALABRAS_UPDATE_FRASE_RESET:
      return {}

    default:
      return state;
  }
};
