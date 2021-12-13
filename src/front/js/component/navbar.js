import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import cameraImgUrl from "../../img/camera.png";
import profileImgUrl from "../../img/profile.png";

const linkStyle = { textDecoration: "none", color: "white" };

export const Navbar = () => {
	const { store, actions } = useContext(Context);

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light fs-1 text-white bg-transparent">
			<div className="container">
				<Link to="/">
					<img src={cameraImgUrl} className="navbar-brand" style={{ width: "75px" }} />
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navDropdown"
					aria-controls="navDropdown"
					aria-expanded="false">
					<span className="navbar-toggler-icon" />
				</button>
				<div className="collapse navbar-collapse" id="navDropdown" style={{ fontFamily: "Permanent Marker" }}>
					<ul className="navbar-nav ms-auto align-items-center">
						<li className="nav-item me-5">
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
								<img src={profileImgUrl} style={{ width: "70px" }} />
							</a>
							<ul className="dropdown-menu fs-3 bg-transparent" aria-labelledby="dropdownMenuLink">
								{store.activeUser.id ? (
									<>
										<a className="dropdown-item" href="#">
											<Link to="/profile" style={linkStyle}>
												Mi perfil
											</Link>
										</a>
										{store.activeUser.category ? (
											<a className="dropdown-item" href="#">
												<Link to="/admin" style={linkStyle}>
													Panel administración
												</Link>
											</a>
										) : (
											""
										)}
										<a
											className="dropdown-item text-white"
											href="#"
											onClick={() => actions.logout()}>
											Cerrar sesión
										</a>
									</>
								) : (
									<>
										<a className="dropdown-item" href="#">
											<Link to="/signup" style={linkStyle}>
												Registrarme
											</Link>
										</a>
										<a className="dropdown-item" href="#">
											<Link to="/login" style={linkStyle}>
												Iniciar sesión
											</Link>
										</a>
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
