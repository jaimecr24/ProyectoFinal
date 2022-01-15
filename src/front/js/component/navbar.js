import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import cameraImgUrl from "../../img/camera.png";
import profileImgUrl from "../../img/profile.png";
import "../../styles/home.css";

const linkStyle = { textDecoration: "none", color: "#e0e0e2" };

export const Navbar = () => {
	const { store, actions } = useContext(Context);

	return (
		<nav className="navbar navbar-expand-lg navbar-dark fs-3 bg-transparent">
			<div className="container">
				<div
					className="collapse navbar-collapse"
					id="navDropdown"
					style={{ fontFamily: "Playfair Display SC" }}>
					<ul className="navbar-nav mx-auto align-items-center">
						<li className="nav-item me-5">
							<Link to="/">
								<img src={cameraImgUrl} className="navbar-brand mx-5" style={{ width: "75px" }} />
							</Link>
						</li>
						<li className="nav-item mx-5">
							<Link to="/films" style={linkStyle}>
								Películas
							</Link>
						</li>
						<li className="nav-item mx-5">
							<Link to="/countries" style={linkStyle}>
								Países
							</Link>
						</li>
						<li className="nav-item mx-5">
							<Link to="/places" style={linkStyle}>
								Sitios
							</Link>
						</li>
						<li className="nav-item ms-5 dropdown">
							<a
								className="nav-link dropdown-toggle"
								href="#"
								id="dropdownMenuLink"
								role="button"
								data-bs-toggle="dropdown"
								aria-expanded="false">
								<img src={profileImgUrl} style={{ width: "60px" }} />
							</a>
							<ul
								className="dropdown-menu fs-3 border border-warning"
								style={{ background: "rgba(43, 65, 98, 0.8)" }}
								aria-labelledby="dropdownMenuLink">
								{store.activeUser.id ? (
									<>
										<div className="dropdown-item">
											<Link to="/profile" style={linkStyle}>
												Mi perfil
											</Link>
										</div>
										{store.activeUser.category ? (
											<div className="dropdown-item">
												<Link to="/admin" style={linkStyle}>
													Panel administración
												</Link>
											</div>
										) : (
											""
										)}
										<a
											className="dropdown-item"
											style={linkStyle}
											href="#"
											onClick={() => actions.logout()}>
											Cerrar sesión
										</a>
									</>
								) : (
									<>
										<div className="dropdown-item">
											<Link to="/signup" style={linkStyle}>
												Registrarme
											</Link>
										</div>
										<div className="dropdown-item">
											<Link to="/login" style={linkStyle}>
												Iniciar sesión
											</Link>
										</div>
									</>
								)}
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};
