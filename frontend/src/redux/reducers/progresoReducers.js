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

export const metaDiariaReducer = (state = {}, action) => {
  switch (action.type) {
    case META_DIARIA_DETAIL_REQUEST:
      return { loading: true };

    case META_DIARIA_DETAIL_SUCCESS:
      return { loading: false, success: true, estadistica: action.payload };

    case META_DIARIA_DETAIL_FAIL:
      return { loading: false, error: action.payload };

    case META_DIARIA_DETAIL_RESET:
      return {}

    default:
      return state;
  }
};

export const cantidadPalabrasRepasadasReducer = (state = {}, action) => {
  switch (action.type) {
    case CANTIDAD_PALABRAS_REPASADAS_DETAIL_REQUEST:
      return { loading: true };

    case CANTIDAD_PALABRAS_REPASADAS_DETAIL_SUCCESS:
      return { loading: false, success: true, palabras: action.payload, grafico: "palabrasRepasadas" };

    case CANTIDAD_PALABRAS_REPASADAS_DETAIL_FAIL:
      return { loading: false, error: action.payload };

    case CANTIDAD_PALABRAS_REPASADAS_DETAIL_RESET:
      return {}

    default:
      return state;
  }
};

export const cantidadPalabrasNuevasReducer = (state = {}, action) => {
  switch (action.type) {
    case CANTIDAD_PALABRAS_NUEVAS_DETAIL_REQUEST:
      return { loading: true };

    case CANTIDAD_PALABRAS_NUEVAS_DETAIL_SUCCESS:
      return { loading: false, success: true, palabras: action.payload };

    case CANTIDAD_PALABRAS_NUEVAS_DETAIL_FAIL:
      return { loading: false, error: action.payload };

    case CANTIDAD_PALABRAS_NUEVAS_DETAIL_RESET:
      return {}

    default:
      return state;
  }
};

export const cantidadDificultadReducer = (state = {}, action) => {
  switch (action.type) {
    case CANTIDAD_DIFICULTAD_DETAIL_REQUEST:
      return { loading: true };

    case CANTIDAD_DIFICULTAD_DETAIL_SUCCESS:
      return { loading: false, success: true, palabras: action.payload };

    case CANTIDAD_DIFICULTAD_DETAIL_FAIL:
      return { loading: false, error: action.payload };

    case CANTIDAD_DIFICULTAD_DETAIL_RESET:
      return {}

    default:
      return state;
  }
};

export const cantidadPalabrasRepasadasIdiomaReducer = (state = {}, action) => {
  switch (action.type) {
    case CANTIDAD_PALABRAS_REPASADAS_IDIOMAS_REQUEST:
      return { loading: true };

    case CANTIDAD_PALABRAS_REPASADAS_IDIOMAS_SUCCESS:
      return { loading: false, success: true, palabras: action.payload };

    case CANTIDAD_PALABRAS_REPASADAS_IDIOMAS_FAIL:
      return { loading: false, error: action.payload };

    case CANTIDAD_PALABRAS_REPASADAS_IDIOMAS_RESET:
      return {}

    default:
      return state;
  }
};

export const cantidadNuevasIdiomaReducer = (state = {}, action) => {
  switch (action.type) {
    case CANTIDAD_PALABRAS_NUEVAS_IDIOMAS_REQUEST:
      return { loading: true };

    case CANTIDAD_PALABRAS_NUEVAS_IDIOMAS_SUCCESS:
      return { loading: false, success: true, palabras: action.payload };

    case CANTIDAD_PALABRAS_NUEVAS_IDIOMAS_FAIL:
      return { loading: false, error: action.payload };

    case CANTIDAD_PALABRAS_NUEVAS_IDIOMAS_RESET:
      return {}

    default:
      return state;
  }
};

export const cantidadVistasNoVistasReducer = (state = {}, action) => {
  switch (action.type) {
    case CANTIDAD_PALABRAS_VISTAS_NO_VISTAS_REQUEST:
      return { loading: true };

    case CANTIDAD_PALABRAS_VISTAS_NO_VISTAS_SUCCESS:
      return { loading: false, success: true, palabras: action.payload };

    case CANTIDAD_PALABRAS_VISTAS_NO_VISTAS_FAIL:
      return { loading: false, error: action.payload };

    case CANTIDAD_PALABRAS_VISTAS_NO_VISTAS_RESET:
      return {}

    default:
      return state;
  }
};

export const cantidadAprendidasPorIdiomaReducer = (state = {}, action) => {
  switch (action.type) {
    case CANTIDAD_PALABRAS_APRENDIDAS_REQUEST:
      return { loading: true };

    case CANTIDAD_PALABRAS_APRENDIDAS_SUCCESS:
      return { loading: false, success: true, palabras: action.payload };

    case CANTIDAD_PALABRAS_APRENDIDAS_FAIL:
      return { loading: false, error: action.payload };

    case CANTIDAD_PALABRAS_APRENDIDAS_RESET:
      return {}

    default:
      return state;
  }
};