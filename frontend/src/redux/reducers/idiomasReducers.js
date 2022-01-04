import {
  IDIOMAS_DETAILS_REQUEST,
  IDIOMAS_DETAILS_SUCCESS,
  IDIOMAS_DETAILS_FAIL,

  IDIOMAS_USER_DETAILS_REQUEST,
  IDIOMAS_USER_DETAILS_SUCCESS,
  IDIOMAS_USER_DETAILS_FAIL,
  IDIOMAS_USER_DETAILS_RESET,

} from "../constants/idiomasConstants";

export const idiomasReducer = (state = {}, action) => {
  switch (action.type) {
    case IDIOMAS_DETAILS_REQUEST:
      return { loading: true, idiomasTotal: [] };

    case IDIOMAS_DETAILS_SUCCESS:
      return { loading: false, success: true, idiomasTotal: action.payload };

    case IDIOMAS_DETAILS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const idiomasUserReducer = (state = {}, action) => {
  switch (action.type) {
    case IDIOMAS_USER_DETAILS_REQUEST:
      return { loading: true, idiomasUserTotal: [] };

    case IDIOMAS_USER_DETAILS_SUCCESS:
      return { loading: false, success: true, idiomasUserTotal: action.payload };

    case IDIOMAS_USER_DETAILS_FAIL:
      return { loading: false, error: action.payload };

    case IDIOMAS_USER_DETAILS_RESET:
      return {}

    default:
      return state;
  }
};

