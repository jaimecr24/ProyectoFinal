import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import cameraImgUrl from "../../img/camera.png";
import profileImgUrl from "../../img/profile.png";
import "../../styles/home.css";

const linkStyle = { textDecoration: "none", color: "#F6F6F6" };

export const Navbar = () => {
	const { store, actions } = useContext(Context);

	return (
		<nav className="navbar navbar-expand-xl navbar-dark fs-3 ms-auto bg-transparent">
			<div className="container px-5">
				<Link to="/" className="navbar-brand ms-1">
					<img src={cameraImgUrl} style={{ width: "75px" }} />
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navDropDown"
					aria-controls="navDropDown"
					aria-expanded="false"
					aria-label="Toggle navigation">
					<span className="navbar-toggler-icon" />
				</button>
				<div className="collapse navbar-collapse" id="navDropDown">
					<ul className="navbar-nav w-100 me-5 pe-5 align-items-center title-one">
						<li className="nav-item ms-auto">
							<Link to="/films" style={linkStyle}>
								Películas
							</Link>
						</li>
						<li className="nav-item ms-auto">
							<Link to="/countries" style={linkStyle}>
								Países
							</Link>
						</li>
						<li className="nav-item ms-auto">
							<Link to="/places" style={linkStyle}>
								Sitios
							</Link>
						</li>
						<li className="nav-item ms-auto dropdown">
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
