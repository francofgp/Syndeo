import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, Nav, Col, Container, Row, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../redux/actions/userActions";
import { Link } from "react-scroll";
import { useHistory } from "react-router-dom";
import Headroom from "react-headroom";
import syndeoBlanco from "../data/imagenesLogoSyndeo/SYNDEO BLANCO.svg";
import syndeoBlancoMobile from "../data/imagenesLogoSyndeo/LOGO BLANCO.svg";
import { isMobileOnly } from "react-device-detect";

function Header() {
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;
	const [noEstoyEnLogin, setNoEstoyEnLogin] = useState(true);
	const [fixedNavBar, setFixedNavBar] = useState(true);
	const dispatch = useDispatch();

	const logoutHandler = () => {
		setNoEstoyEnLogin(false);
		dispatch(logout());
	};

	useEffect(() => {
		if (
			window.location.pathname === "/login" ||
			window.location.pathname === "/activarCuenta" ||
			window.location.pathname.includes("/activacion")
		) {
			setNoEstoyEnLogin(false);
		}
		if (window.location.pathname === "/") {
			setFixedNavBar(true);
		}
	}, []);

	const history = useHistory();
	useEffect(() => {
		return history.listen((location) => {
			if (location.pathname.includes("/estudiar/") || location.pathname.includes("/verCategorias")) {
				setFixedNavBar(false);
			} else {
				setFixedNavBar(true);
			}
		});
	}, [history]);

	return (
		<Headroom>
			<header style={{ paddingTop: fixedNavBar ? "80px" : "0px" }}>
				<Navbar
					className="navbar navbar-expand-lg navbar-dark bg-primary"
					/* bg="dark"
				variant="dark"*/
					expand="lg"
					collapseOnSelect
					fixed={fixedNavBar ? "top" : ""}
				>
					<Container>
						{!userInfo ? (
							<LinkContainer to="/">
								<Navbar.Brand
									onClick={() => {
										setNoEstoyEnLogin(true);
									}}
								>
									<img
										width={isMobileOnly ? "130px" : "150px"}
										height="auto"
										src={isMobileOnly ? syndeoBlanco : syndeoBlanco}
										alt="Logo Syndeo"
									/>
								</Navbar.Brand>
							</LinkContainer>
						) : (
							<LinkContainer style={{ marginRight: "10vw" }} to="/progreso">
								<Navbar.Brand
									onClick={() => {
										setNoEstoyEnLogin(true);
									}}
								>
									<img
										width={isMobileOnly ? "130px" : "150px"}
										height="auto"
										src={isMobileOnly ? syndeoBlanco : syndeoBlanco}
										alt="Logo Syndeo"
									/>
								</Navbar.Brand>
							</LinkContainer>
						)}

						<Navbar.Toggle aria-controls="basic-navbar-nav" />

						<Navbar.Collapse id="basic-navbar-nav">
							{userInfo ? (
								<Nav className="container-fluid">
									<NavDropdown title="Textos" className="ml-auto">
										<LinkContainer to="/verTextos">
											<NavDropdown.Item>
												<i className="fas fa-search"></i> Ver
											</NavDropdown.Item>
										</LinkContainer>

										<LinkContainer to="/registrarTexto">
											<NavDropdown.Item>
												<i className="fas fa-plus"></i> Nuevo
											</NavDropdown.Item>
										</LinkContainer>

										<LinkContainer to="/verCategorias">
											<NavDropdown.Item>
												<i class="fas fa-bookmark"></i> Categorías
											</NavDropdown.Item>
										</LinkContainer>
									</NavDropdown>

									<NavDropdown title="Vocabulario" className="ml-auto">
										<LinkContainer to="/verPalabras">
											<NavDropdown.Item>
												<i className="fas fa-search"></i> Ver
											</NavDropdown.Item>
										</LinkContainer>
										<LinkContainer to="/configuracionExportar">
											<NavDropdown.Item>
												<i class="fas fa-file-export"></i> Exportar
											</NavDropdown.Item>
										</LinkContainer>
									</NavDropdown>

									<Nav.Item className="ml-auto">
										<LinkContainer to="/progreso">
											<Nav.Link>Progreso</Nav.Link>
										</LinkContainer>
									</Nav.Item>

									<Nav.Item className="ml-auto">
										<LinkContainer to="/configuracionRepasar">
											<Nav.Link>Repasar</Nav.Link>
										</LinkContainer>
									</Nav.Item>

									<NavDropdown className="ml-auto" title={`Hola ${userInfo.name}!`} id="username">
										<LinkContainer to="/progreso">
											<NavDropdown.Item>
												<i class="fas fa-search"></i> Ver perfil
											</NavDropdown.Item>
										</LinkContainer>

										<LinkContainer to="/profile">
											<NavDropdown.Item>
												<i class="fas fa-user-edit"></i> Editar perfil
											</NavDropdown.Item>
										</LinkContainer>

										<NavDropdown.Item onClick={logoutHandler}>
											<i class="fas fa-sign-out-alt"></i> Cerrar sesión
										</NavDropdown.Item>
									</NavDropdown>
								</Nav>
							) : (
								<Nav className="container-fluid">
									<Nav.Item>
										<LinkContainer to="/">
											<Link
												className="nav-link"
												to="hero"
												smooth={true}
												duration={750}
												ignoreCancelEvents={true}
												onClick={() => {
													setNoEstoyEnLogin(true);
												}}
											>
												Inicio
											</Link>
										</LinkContainer>
									</Nav.Item>
									{noEstoyEnLogin ? (
										<Nav.Item>
											<LinkContainer to="/">
												<Link
													className="nav-link"
													to="aboutSyndeo"
													smooth={true}
													duration={750}
													ignoreCancelEvents={true}
													onClick={() => {
														setNoEstoyEnLogin(true);
													}}
												>
													Sobre Syndeo
												</Link>
											</LinkContainer>
										</Nav.Item>
									) : null}

									{noEstoyEnLogin ? (
										<Nav.Item>
											<LinkContainer to="/">
												<Link
													className="nav-link"
													to="feature"
													smooth={true}
													duration={750}
													ignoreCancelEvents={true}
													onClick={() => {
														setNoEstoyEnLogin(true);
													}}
												>
													Características
												</Link>
											</LinkContainer>
										</Nav.Item>
									) : null}

									{/* {noEstoyEnLogin ? (
									<Nav.Item>
										<LinkContainer to="/">
											<Link
												className="nav-link"
												to="service"
												smooth={true}
												duration={750}
												ignoreCancelEvents={true}
												onClick={() => {
													setNoEstoyEnLogin(true);
												}}
											>
												Servicios
											</Link>
										</LinkContainer>
									</Nav.Item>
								) : null} */}

									{noEstoyEnLogin ? (
										<Nav.Item>
											<LinkContainer to="/">
												<Link
													className="nav-link"
													to="about"
													smooth={true}
													duration={750}
													ignoreCancelEvents={true}
													onClick={() => {
														setNoEstoyEnLogin(true);
													}}
												>
													Nosotros
												</Link>
											</LinkContainer>
										</Nav.Item>
									) : null}

									<Nav.Item className="ml-auto">
										<LinkContainer to="/login">
											<Nav.Link
												className="ml-auto"
												onClick={() => {
													setNoEstoyEnLogin(false);
												}}
											>
												<i className="fas fa-user" /> Iniciar Sesión
											</Nav.Link>
										</LinkContainer>
									</Nav.Item>
								</Nav>
							)}
						</Navbar.Collapse>
					</Container>
				</Navbar>
			</header>
		</Headroom>
	);
}
export default Header;
