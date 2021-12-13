import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/modal.css";
import iconadmin from "../../img/admin-icon.png";

const Users = () => {
	const { store, actions } = useContext(Context);
	const [data, setData] = useState({
		users: []
	});
	useEffect(() => {
		// load users data
		fetch(process.env.BACKEND_URL + "/api/users", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + store.activeUser.token
			}
		})
			.then(res => res.json())
			.then(users => setData({ ...data, users: users }))
			.catch(error => console.log(error));
	}, []);
	return (
		<div>
			<div>Información de usuarios</div>
		</div>
	);
};

const Films = () => {
	const { store, actions } = useContext(Context);
	const [data, setData] = useState({
		films: []
	});
	/*
	useEffect(() => {
		// load users data
		fetch(process.env.BACKEND_URL + "/api/users")
			.then(res => res.json())
			.then(users => setData({ ...data, users: users }))
			.catch(error => console.log(error));
	}, []);
	*/
	return (
		<div>
			<div>Información de películas</div>
		</div>
	);
};

const Places = () => {
	const { store, actions } = useContext(Context);
	const [data, setData] = useState({
		places: []
	});
	useEffect(() => {
		// load users data
		fetch(process.env.BACKEND_URL + "/api/places")
			.then(res => res.json())
			.then(places => setData({ ...data, places: places }))
			.catch(error => console.log(error));
	}, []);

	return (
		<>
			{data.places.length > 0 ? (
				<table className="table text-white">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">nombre</th>
							<th scope="col">latitud</th>
							<th scope="col">longitud</th>
							<th scope="col">descripción</th>
							<th scope="col">contador de likes</th>
						</tr>
					</thead>
					<tbody>
						{data.places.map((e, i) => (
							<tr key={i}>
								<th scope="row">{e.id}</th>
								<td>{e.name}</td>
								<td>{e.latitude}</td>
								<td>{e.longitude}</td>
								<td>{e.description}</td>
								<td>{e.countLikes}</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				""
			)}
		</>
	);
};

export const Admin = () => {
	const { store, actions } = useContext(Context);
	const [data, setData] = useState({
		tableSelected: 0 // 0 - none, 1 - users, 2 - films, 3 - places
	});
	let history = useHistory();

	useEffect(() => {
		// test token validity
		let status = 200;
		actions
			.getUser()
			.then(res => {
				status = res.status;
				return res.json();
			})
			.then(responseUser => {
				if (status >= 400) {
					alert(responseUser["msg"]);
					actions.logout();
					// history.push({ pathname: "/" });
				}
			})
			.catch(error => {
				alert("Error: " + error);
				actions.logout();
			});
	}, []);

	return (
		<div className="container-fluid">
			<div className="row flex-nowrap">
				<div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
					<div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100 fs-5">
						<div className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-decoration-none text-white">
							<span className="fs-4 d-none d-sm-inline">Menu</span>
						</div>
						<hr className="w-100 bg-white" />
						<ul
							className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
							id="menu">
							<li className="nav-item">
								<a
									href="#"
									className="nav-link align-middle px-0 text-white"
									onClick={() => setData({ tableSelected: 0 })}>
									<i className="fs-4 bi-house" />{" "}
									<span className="ms-1 d-none d-sm-inline">Inicio</span>
								</a>
							</li>
							<li className="nav-item">
								<a
									href="#"
									className="nav-link align-middle px-0 text-white"
									onClick={() => setData({ tableSelected: 1 })}>
									<i className="fs-4 bi-house" />{" "}
									<span className="ms-1 d-none d-sm-inline">Usuarios</span>
								</a>
							</li>
							<li className="nav-item">
								<a
									href="#"
									className="nav-link align-middle px-0 text-white"
									onClick={() => setData({ tableSelected: 2 })}>
									<i className="fs-4 bi-house" />{" "}
									<span className="ms-1 d-none d-sm-inline">Películas</span>
								</a>
							</li>
							<li className="nav-item">
								<a
									href="#"
									className="nav-link align-middle px-0 text-white"
									onClick={() => setData({ tableSelected: 3 })}>
									<i className="fs-4 bi-house" />{" "}
									<span className="ms-1 d-none d-sm-inline">Sitios</span>
								</a>
							</li>
							<li>
								<a
									href="#submenu1"
									data-bs-toggle="collapse"
									className="nav-link px-0 align-middle text-white">
									<i className="fs-4 bi-speedometer2" />{" "}
									<span className="ms-1 d-none d-sm-inline">Dashboard</span>{" "}
								</a>
								<ul className="collapse show nav flex-column ms-1" id="submenu1" data-bs-parent="#menu">
									<li className="w-100">
										<a href="#" className="nav-link px-0 text-white">
											{" "}
											<span className="d-none d-sm-inline">Item</span> 1{" "}
										</a>
									</li>
									<li>
										<a href="#" className="nav-link px-0 text-white">
											{" "}
											<span className="d-none d-sm-inline">Item</span> 2{" "}
										</a>
									</li>
								</ul>
							</li>
							<li>
								<a href="#" className="nav-link px-0 align-middle text-white">
									<i className="fs-4 bi-table" />{" "}
									<span className="ms-1 d-none d-sm-inline">Orders</span>
								</a>
							</li>
							<li>
								<a href="#" className="nav-link px-0 align-middle text-white">
									<i className="fs-4 bi-people" />{" "}
									<span className="ms-1 d-none d-sm-inline">Customers</span>{" "}
								</a>
							</li>
						</ul>
						<hr />
						<div className="dropdown pb-4">
							<a
								href="#"
								className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
								id="dropdownUser1"
								data-bs-toggle="dropdown"
								aria-expanded="false">
								<img src={iconadmin} alt="hugenerd" width="30" height="30" className="rounded-circle" />
								<span className="d-none d-sm-inline mx-1">admin</span>
							</a>
							<ul className="dropdown-menu dropdown-menu-dark text-small shadow">
								<li>
									<a className="dropdown-item" href="#">
										New project...
									</a>
								</li>
								<li>
									<a className="dropdown-item" href="#">
										Settings
									</a>
								</li>
								<li>
									<a className="dropdown-item" href="#">
										Profile
									</a>
								</li>
								<li>
									<hr className="dropdown-divider" />
								</li>
								<li>
									<a className="dropdown-item" href="#">
										Sign out
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="col py-3">
					{data.tableSelected == 1 ? (
						<Users />
					) : data.tableSelected == 2 ? (
						<Films />
					) : data.tableSelected == 3 ? (
						<Places />
					) : (
						""
					)}
				</div>
			</div>
		</div>
	);
};
