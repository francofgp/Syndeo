import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles/globals.css";
import "./styles/shareButtons.css";

import HomeScreen from "./screens/HomeScreen";
import InicioScreen from "./screens/InicioScreen";
import VerTextosScreen from "./screens/VerTextosScreen";
import ModificarTextoScreen from "./screens/ModificarTextoScreen";
import VerPalabrasScreen from "./screens/VerPalabrasScreen";
import VerCategoriasScreen from "./screens/VerCategoriasScreen";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RegistrarTextoScreen from "./screens/RegistrarTextoScreen";
import EstudiarScreen from "./screens/EstudiarScreen";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "react-bootstrap";
import RepasarScreen from "./screens/RepasarScreen";
import PreRepasarScreen from "./screens/PreRepasarScreen";
import NotFoundScreen from "./screens/NotFoundScreen";
import RegistrarCategoriaScreen from "./screens/RegistrarCategoriaScreen";
import ProgresoScreen from "./screens/ProgresoScreen";
import ExportarPDFScreen from "./screens/ExportarPDFScreen";
import RecoveryPasswordScreen from "./screens/RecoveryPasswordScreen";
import RecoveryPasswordConfirmScreen from "./screens/RecoveryPasswordConfirmScreen";
import ActivarCuentaScreen from "./screens/ActivarCuentaScreen";
import ActivacionExitosaScreen from "./screens/ActivacionExitosaScreen";

function App() {
	return (
		<Router>
			<Header />
			<main className="py-3">
				<Container>
					<Switch>
						<Route path="/" component={HomeScreen} exact />
						<Route path="/inicio" component={InicioScreen} exact />
						<Route path="/login" component={LoginScreen} />
						<Route path="/register" component={RegisterScreen} />
						<Route path="/profile" component={ProfileScreen} />
						<Route
							path="/RegistrarTexto"
							component={RegistrarTextoScreen}
						/>
						<Route path="/verTextos" component={VerTextosScreen} />
						<Route
							path="/modificarTexto/:id"
							component={ModificarTextoScreen}
						/>
						<Route
							path="/estudiar/:id"
							component={EstudiarScreen}
						/>
						<Route
							path="/verPalabras"
							component={VerPalabrasScreen}
						/>
						<Route
							path="/configuracionExportar"
							component={ExportarPDFScreen}
						/>
						<Route
							path="/configuracionRepasar"
							component={PreRepasarScreen}
						/>
						<Route
							path="/repasar/:idioma/:cantidad/:orden/:modo"
							component={RepasarScreen}
						/>
						<Route
							path="/verCategorias"
							component={VerCategoriasScreen}
						/>
						<Route
							path="/registrarCategoria"
							component={RegistrarCategoriaScreen}
						/>
						<Route path="/progreso" component={ProgresoScreen} />
						<Route
							path="/reiniciarPass"
							component={RecoveryPasswordScreen}
						/>
						<Route
							path="/nuevaPassword/:uid/:token"
							component={RecoveryPasswordConfirmScreen}
						/>
						<Route
							path="/activarCuenta"
							component={ActivarCuentaScreen}
						/>
						<Route
							path="/activacion/:uid/:token"
							component={ActivacionExitosaScreen}
						/>

						<Route component={NotFoundScreen} />
					</Switch>
				</Container>
			</main>
			<Footer />
		</Router>
	);
}

export default App;
