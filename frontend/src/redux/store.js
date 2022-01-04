import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
	userLoginReducer, userRegisterReducer, userDetailsReducer, userUpdateProfileReducer, userInfoReducer,
	resetPasswordReducer, perfilInfoEstadisticaReducer, resetPasswordConfirmReducer,activateAccountReducer
} from "./reducers/userReducers";
import { idiomasReducer, idiomasUserReducer } from "./reducers/idiomasReducers";
import {
	textoRegisterReducer, textoUpdateReducer, textoDetailsReducer, textosDetailsReducer, textoDeleteReducer,
	fechaUltimaLecturaReducer, marcarComoLeidoReducer, checkTextoReducer
} from "./reducers/textosReducers";
import { categoriasReducer, categoriasRegisterReducer, categoriasDeleteReducer, categoriaUpdateReducer } from "./reducers/categoriasReducers";
import {
	palabrasDetailsReducer, palabraUpdateReducer, actualizarPalabrasARepasarReducer, palabrasARepasarReducer,
	actualizarFraseDificultadReducer, actualizarPalabraDificultadReducer, traduccionPalabraReducer
} from "./reducers/palabrasReducers"
import {
	metaDiariaReducer, cantidadPalabrasRepasadasReducer, cantidadPalabrasNuevasReducer,
	cantidadNuevasIdiomaReducer, cantidadDificultadReducer, cantidadPalabrasRepasadasIdiomaReducer,
	cantidadVistasNoVistasReducer, cantidadAprendidasPorIdiomaReducer,
} from "./reducers/progresoReducers"

const reducer = combineReducers({
	/*aca seteo que reducers (funciones que se usan para cambiar estados) voy a tener */

	userLogin: userLoginReducer,
	userRegister: userRegisterReducer,
	userDetails: userDetailsReducer,
	userUpdateProfile: userUpdateProfileReducer,
	userInfo: userInfoReducer,
	perfilInfoEstadistica: perfilInfoEstadisticaReducer,
	resetPassword: resetPasswordReducer,
	resetPasswordConfirm : resetPasswordConfirmReducer,
	activateAccount:activateAccountReducer,
	idiomas: idiomasReducer,
	idiomasUser: idiomasUserReducer,

	textosRegister: textoRegisterReducer,
	textosUpdate: textoUpdateReducer,
	textoInfo: textoDetailsReducer,
	textosInfo: textosDetailsReducer,
	textosDelete: textoDeleteReducer,
	fechaUltimaLectura: fechaUltimaLecturaReducer,
	marcarComoLeido: marcarComoLeidoReducer,
	checkTexto: checkTextoReducer,

	categorias: categoriasReducer,
	categoriasRegister: categoriasRegisterReducer,
	categoriasDelete: categoriasDeleteReducer,
	categoriasUpdate: categoriaUpdateReducer,

	palabrasDetails: palabrasDetailsReducer,
	palabraUpdate: palabraUpdateReducer,
	actualizarPalabrasARepasar: actualizarPalabrasARepasarReducer,
	palabrasARepasar: palabrasARepasarReducer,
	palabraTraduccion: traduccionPalabraReducer,
	actualizarFraseDificultad: actualizarFraseDificultadReducer,
	actualizarPalabraDificultad: actualizarPalabraDificultadReducer,

	progresoMetaDiaria: metaDiariaReducer,
	cantidadPalabrasRepasadas: cantidadPalabrasRepasadasReducer,
	cantidadPalabrasNuevas: cantidadPalabrasNuevasReducer,
	cantidadDificultad: cantidadDificultadReducer,
	cantidadPalabrasRepasadasIdioma: cantidadPalabrasRepasadasIdiomaReducer,
	cantidadNuevasIdioma: cantidadNuevasIdiomaReducer,
	cantidadVistasNoVistas: cantidadVistasNoVistasReducer,
	cantidadAprendidasPorIdioma: cantidadAprendidasPorIdiomaReducer
});

const userInfoFromStorage = localStorage.getItem("userInfo")
	? JSON.parse(localStorage.getItem("userInfo"))
	: null;

const initialState = {
	userLogin: { userInfo: userInfoFromStorage },
	idiomas: { idiomasTotal: [] },
	idiomasUser: { idiomasUserTotal: [] },
	categorias: { categoriasTotal: [] },
	textosInfo: { textos: [] },
	textoInfo: { textoInfo: [] },
	palabrasDetails: { palabras: [] },
};

const middleware = [thunk];
/* el thunk permite las funciones asyncronicas */

const store = createStore(
	reducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
