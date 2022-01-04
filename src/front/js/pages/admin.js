import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/modal.css";
import iconadmin from "../../img/admin-icon.png";

const Users = () => {
	const usersPage = 10; // Number of rows per page
	const { store, actions } = useContext(Context);
	const [data, setData] = useState({
		name: "",
		last_name: "",
		username: "",
		email: "",
		isAdmin: false,
		users: [],
		limInf: 0,
		limSup: usersPage,
		totalPages: 0,
		currentPage: 0
	});
	// values when a row is in edit mode:
	const [inEditMode, setInEditMode] = useState({ status: false, rowKey: null });

	useEffect(() => {
		// load number of users and first page
		fetch(process.env.BACKEND_URL + "/api/users/count")
			.then(res => res.json())
			.then(res => {
				data.totalPages = Math.floor(res.count / usersPage) + 1;
				data.currentPage = 1;
				loadData();
			})
			.catch(error => alert(error));
	}, []);

	const loadData = () => {
		// load n rows of data between data.limInf and data.limSup
		fetch(`${process.env.BACKEND_URL}/api/users/${data.limInf}/${data.limSup}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + store.activeUser.token
			}
		})
			.then(res => res.json())
			.then(users => setData({ ...data, users: users }))
			.catch(error => console.log(error));
	};

	const handleChange = e => {
		// changes of data in edit mode
		setData({ ...data, [e.target.name]: e.target.value });
	};

	const handleChangeCheckBox = e => {
		// specific for checkbox admin
		setData({ ...data, [e.target.name]: e.target.checked });
	};

	const handleEdit = item => {
		// enter in edit mode
		setInEditMode({ status: true, rowKey: item.id });
		setData({
			...data,
			name: item.name,
			last_name: item.last_name,
			username: item.username,
			email: item.email,
			isAdmin: item.category
		});
	};

	const handleCancel = () => {
		// discard changes and exit from edit mode
		setInEditMode({ status: false, rowKey: null });
		setData({ ...data, name: "", last_name: "", username: "", email: "" });
	};

	const handleSave = () => {
		// save changes and exit from edit mode
		fetch(process.env.BACKEND_URL + "/api/user/" + inEditMode.rowKey.toString(), {
			method: "PUT",
			body: JSON.stringify({
				name: data.name,
				last_name: data.last_name,
				username: data.username,
				email: data.email,
				category: data.isAdmin
			}),
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + store.activeUser.token
			}
		})
			.then(res => res.json())
			.then(json => {
				handleCancel();
				loadData();
			})
			.catch(error => alert(error));
	};

	const handleDelete = item => {
		// delete user
		if (confirm(`¿Eliminar usuario ${item.username}?`)) {
			fetch(process.env.BACKEND_URL + "/api/user/" + item.id.toString(), {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + store.activeUser.token
				}
			})
				.then(res => res.json())
				.then(json => loadData())
				.catch(error => alert(error));
		}
	};

	const gotoPage = n => {
		data.currentPage = n;
		data.limInf = usersPage * (n - 1);
		data.limSup = data.limInf + usersPage;
		loadData();
	};

	// For show data in each row
	const datastyle = { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };
	return (
		<>
			{data.users.length > 0 ? (
				<table className="table text-white" style={{ tableLayout: "fixed" }}>
					<thead>
						<tr>
							<th scope="col" width="5%">
								#
							</th>
							<th scope="col" width="15%">
								nombre
							</th>
							<th scope="col" width="15%">
								apellido
							</th>
							<th scope="col" width="15%">
								email
							</th>
							<th scope="col" width="15%">
								username
							</th>
							<th scope="col" width="5%">
								admin
							</th>
							<th scope="col" width="10%" />
						</tr>
					</thead>
					<tbody>
						{data.users.map(e => (
							<tr key={e.id}>
								<th scope="row">{e.id}</th>
								<td style={datastyle}>
									{inEditMode.status && inEditMode.rowKey === e.id ? (
										<input name="name" value={data.name} onChange={handleChange} />
									) : (
										e.name
									)}
								</td>
								<td style={datastyle}>
									{inEditMode.status && inEditMode.rowKey === e.id ? (
										<input name="last_name" value={data.last_name} onChange={handleChange} />
									) : (
										e.last_name
									)}
								</td>
								<td style={datastyle}>
									{inEditMode.status && inEditMode.rowKey === e.id ? (
										<input name="email" value={data.email} onChange={handleChange} />
									) : (
										e.email
									)}
								</td>
								<td style={datastyle}>
									{inEditMode.status && inEditMode.rowKey === e.id ? (
										<input name="username" value={data.username} onChange={handleChange} />
									) : (
										e.username
									)}
								</td>
								<td style={datastyle}>
									<input
										type="checkbox"
										checked={
											inEditMode.status && inEditMode.rowKey === e.id ? data.isAdmin : e.category
										}
										disabled={!inEditMode.status || inEditMode.rowKey !== e.id}
										style={{ width: "16px", height: "16px" }}
										name="isAdmin"
										onChange={handleChangeCheckBox}
									/>
								</td>
								<td style={datastyle}>
									{inEditMode && inEditMode.rowKey === e.id ? (
										<>
											<button className="btn-success" onClick={handleSave}>
												Guardar
											</button>
											<button className="btn-secondary ms-1" onClick={handleCancel}>
												Cancelar
											</button>
										</>
									) : (
										<>
											<button
												className={`btn-primary ${store.activeUser.id == e.id ? "d-none" : ""}`}
												onClick={() => handleEdit(e)}>
												Editar
											</button>
											<button
												className={`btn-danger ms-1 ${
													store.activeUser.id == e.id ? "d-none" : ""
												}`}
												onClick={() => handleDelete(e)}>
												Eliminar
											</button>
										</>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				""
			)}
			<button onClick={() => gotoPage(1)} disabled={data.currentPage === 1}>
				{"<<"}
			</button>{" "}
			<button onClick={() => gotoPage(data.currentPage - 1)} disabled={data.currentPage === 1}>
				{"<"}
			</button>{" "}
			<button onClick={() => gotoPage(data.currentPage + 1)} disabled={data.currentPage === data.totalPages}>
				{">"}
			</button>{" "}
			<button onClick={() => gotoPage(data.totalPages)} disabled={data.currentPage === data.totalPages}>
				{">>"}
			</button>{" "}
			<span className="text-warning fw-bold">{`Página ${data.currentPage} de ${data.totalPages}`}</span>
			<span className="text-warning fw-bold"> | Ir a la página: </span>
			<input
				type="number"
				defaultValue={1}
				min="1"
				max={data.totalPages.toString()}
				onChange={e => {
					const page = e.target.value ? Number(e.target.value) : 1;
					if (page > 0 && page <= data.totalPages) gotoPage(page);
				}}
			/>
		</>
	);
};

const Films = () => {
	const { store, actions } = useContext(Context);
	const [data, setData] = useState({
		films: []
	});

	useEffect(() => {
		fetch(process.env.BACKEND_URL + "/api/films")
			.then(res => res.json())
			.then(films => setData({ ...data, films: films }))
			.catch(error => console.log(error));
	}, []);

	const datastyle = { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };
	return (
		<>
			{data.films.length > 0 ? (
				<table className="table text-white" style={{ tableLayout: "fixed" }}>
					<thead>
						<tr>
							<th scope="col" width="5%">
								#
							</th>
							<th scope="col" width="25%">
								título
							</th>
							<th scope="col" width="15%">
								director
							</th>
							<th scope="col" width="5%">
								año
							</th>
							<th scope="col" width="15%">
								urlPhoto
							</th>
							<th scope="col">descripción</th>
						</tr>
					</thead>
					<tbody>
						{data.films.map((e, i) => (
							<tr key={i}>
								<th scope="row">{e.id}</th>
								<td style={datastyle}>{e.name}</td>
								<td style={datastyle}>{e.director}</td>
								<td style={datastyle}>{e.year}</td>
								<td style={datastyle}>{e.urlPhoto}</td>
								<td style={datastyle}>{e.description}</td>
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

const Places = () => {
	const { store, actions } = useContext(Context);
	const [data, setData] = useState({
		places: []
	});
	useEffect(() => {
		fetch(process.env.BACKEND_URL + "/api/places")
			.then(res => res.json())
			.then(places => setData({ ...data, places: places }))
			.catch(error => console.log(error));
	}, []);

	const datastyle = { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };

	return (
		<>
			{data.places.length > 0 ? (
				<table className="table text-white" style={{ tableLayout: "fixed" }}>
					<thead>
						<tr>
							<th scope="col" width="5%">
								#
							</th>
							<th scope="col" width="20%">
								nombre
							</th>
							<th scope="col" width="10%">
								latitud
							</th>
							<th scope="col" width="10%">
								longitud
							</th>
							<th scope="col" width="20%">
								dirección
							</th>
							<th scope="col">descripción</th>
							<th scope="col" width="5%">
								likes
							</th>
						</tr>
					</thead>
					<tbody>
						{data.places.map((e, i) => (
							<tr key={i}>
								<th scope="row">{e.id}</th>
								<td style={datastyle}>{e.name}</td>
								<td style={datastyle}>{e.latitude}</td>
								<td style={datastyle}>{e.longitude}</td>
								<td style={datastyle}>{e.address}</td>
								<td style={datastyle}>{e.description}</td>
								<td style={datastyle}>{e.countLikes}</td>
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
		tableSelected: 0 // 0 - none, 1 - users, 2 - films, 3 - places, 7 - import file
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
							<li className="nav-item">
								<a
									href="#"
									className="nav-link align-middle px-0 text-white"
									//onClick={() => setData({ tableSelected: 3 })}
								>
									<i className="fs-4 bi-house" />{" "}
									<span className="ms-1 d-none d-sm-inline">Países</span>
								</a>
							</li>
							<li>
								<a
									href="#submenu1"
									data-bs-toggle="collapse"
									className="nav-link px-0 align-middle text-white">
									<i className="fs-4 bi-speedometer2" />{" "}
									<span className="ms-1 d-none d-sm-inline">Fotos</span>{" "}
								</a>
								<ul className="collapse show nav flex-column ms-1" id="submenu1" data-bs-parent="#menu">
									<li className="w-100">
										<a href="#" className="nav-link px-0 text-white">
											{" "}
											<span className="d-none d-sm-inline">De películas</span>{" "}
										</a>
									</li>
									<li>
										<a href="#" className="nav-link px-0 text-white">
											{" "}
											<span className="d-none d-sm-inline">De escenas</span>{" "}
										</a>
									</li>
								</ul>
							</li>
							<li className="nav-item">
								<a
									href="#"
									className="nav-link align-middle px-0 text-white"
									onClick={() => setData({ tableSelected: 7 })}>
									<i className="fs-4 bi-house" />{" "}
									<span className="ms-1 d-none d-sm-inline">Importar datos</span>
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
									<Link to="/" className="dropdown-item">
										Salir
									</Link>
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
					) : data.tableSelected == 7 ? (
						<ShowFile />
					) : (
						""
					)}
				</div>
			</div>
		</div>
	);
};

const ShowFile = () => {
	const [data, setData] = useState("");
	useEffect(() => {
		alert("ready to download data...");
		// Prueba de descarga en json de la información de lugares
		fetch(process.env.BACKEND_URL + "/api/places")
			.then(resp => resp.json())
			.then(places => {
				const bblob = new Blob([JSON.stringify(places)]);
				let pp = document.createElement("a");
				pp.setAttribute("href", URL.createObjectURL(bblob));
				pp.setAttribute("download", "dataplaces.json");
				pp.click();
				//Falta eliminar el elemento
			})
			.catch(error => console.log("Error loading places from backend", error));
	}, []);

	// Prueba de lectura síncrona de ficheros por fragmentos
	const readFile = async e => {
		let file = e.target.files[0];

		alert("ready to load data...");
		// Prueba de carga de fichero en json con la info de lugares
		let myfile = new FileReader();
		myfile.onload = function(e) {
			let content = e.target.result;
			let mydata = JSON.parse(content);
			setData(content);
		};
		myfile.readAsText(file);
	};

	return (
		<>
			<input type="file" id="file-input" onChange={readFile} />
			<textarea className="w-100 h-75 text-black bg-white" value={data} />
		</>
	);
};
