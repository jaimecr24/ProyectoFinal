import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Context } from "../store/appContext";
import usericon from "../../img/users.png";
import "../../styles/modal.css";

export const FormLogin = () => {
	const { actions } = useContext(Context);
	const [data, setData] = useState({
		identifier: "",
		password: ""
	});

	let history = useHistory();
	const responseStatus = { 463: "nombre de usuario no existe", 464: "email no existe", 465: "contraseña incorrecta" };

	const handleChange = e => {
		setData({
			...data,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = e => {
		e.preventDefault();
		let msg = "";
		let isUsername = false;

		if (!isValidEmail(data.identifier)) {
			// Must be username
			isUsername = isValidUserName(data.identifier);
			if (!isUsername) msg = "Identificador no válido";
		}
		if (msg == "") {
			// validation password
			if (data.password.length < 6) msg = "Password debe tener como mínimo 6 caracteres";
			else {
				let username, email;
				if (isUsername) {
					username = data.identifier;
					email = null;
				} else {
					username = null;
					email = data.identifier;
				}
				actions
					.login(email, username, data.password)
					.then(res => {
						if (res.status >= 400) {
							ShowMessage(responseStatus[res.status]);
						}
						return res.json();
					})
					.then(json => {
						if (json.token) {
							actions.setActiveUser({
								token: json.token,
								id: json.id,
								lastTime: json.lastTime,
								category: json.category
							});
							history.goBack();
						}
					})
					.catch(function(error) {
						ShowMessage(error.message);
					});
			}
		}
		if (msg !== "") {
			let form = document.getElementById("formLogin");
			for (let i = 0; i < form.children.length; i++) {
				if (form.children[i].localName === "input") form.children[i].required = true;
			}
			ShowMessage(msg);
		}
	};

	const ShowMessage = message => {
		document.getElementById("errorLogin").innerText = message;
		document.getElementById("errorLogin").style.display = "block";
	};

	return (
		<div className="custom-modal" style={{ paddingTop: "10rem" }}>
			<div className="custom-modal-content mx-auto" style={{ width: "50rem" }}>
				<div className="header d-flex flex-row">
					<h3 className="text-white mx-auto my-3">Iniciar sesión</h3>
					<Link to="/">
						<button
							className="ms-auto mb-5 border-0 px-2"
							type="button"
							style={{ color: "white", background: "blue" }}>
							X
						</button>
					</Link>
				</div>
				<div align="center">
					<img src={usericon} width="180px" />
					<div
						id="errorLogin"
						style={{
							background: "#ffeeee",
							color: "#cc3350",
							marginBottom: "1rem",
							display: "none"
						}}>
						Texto de error
					</div>
					<form id="formLogin" className="w-75 mt-3" onSubmit={handleSubmit}>
						<div className="input-group mb-3">
							<span className="input-group-text border-0" style={{ background: "blue", color: "white" }}>
								<i className="fas fa-user" />
							</span>
							<input
								className="form-control fs-4"
								name="identifier"
								placeholder="Email o nombre de usuario"
								onChange={handleChange}
								value={data.identifier}
								autoFocus
							/>
						</div>
						<div className="input-group mb-3">
							<span className="input-group-text border-0" style={{ background: "blue", color: "white" }}>
								<i className="fas fa-lock" />
							</span>
							<input
								type="password"
								name="password"
								className="form-control fs-4"
								placeholder="Contraseña"
								onChange={handleChange}
								value={data.password}
							/>
						</div>
						<button
							type="submit"
							className="btn w-50 fs-5 text-white mt-3"
							style={{ background: "blue" }}
							onClick={handleSubmit}>
							ENTRAR
						</button>
					</form>
					<div className="mt-5 fs-5 text-white">¿Todavía no se ha registrado?</div>
					<Link to="/signup">
						<button type="button" className="btn w-50 fs-5 text-white my-4" style={{ background: "blue" }}>
							REGISTRARSE AHORA
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

function isValidEmail(email) {
	let regEmail = /^[a-z0-9ñÑ._%+-]+@[a-z0-9ñÑ.-]+\.[a-z]{2,4}$/;
	return regEmail.test(email);
}

function isValidUserName(username) {
	let regUsername = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ]+$/;
	return regUsername.test(username);
}
