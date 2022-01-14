import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import PropTypes from "prop-types";
import "../../styles/modal.css";
import iconadmin from "../../img/admin-icon.png";
import ModalMsg from "../component/modalmsg";

// COMPONENT -------------------------------------------------------------------
const Users = () => {
	const usersPage = 10; // Number of rows per page
	const { store, actions } = useContext(Context);

	// variable to show modal messages and function to close modal.
	const [onModal, setOnModal] = useState({ status: false, msg: "", fClose: null });
	const handleCloseModal = bLogout => {
		setOnModal({ status: false, msg: "", fClose: null });
		if (bLogout) actions.logout(); // close user session
	};

	// values when a row is in edit mode:
	const [inEditMode, setInEditMode] = useState({ status: false, rowKey: null });

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

	useEffect(() => {
		// load number of users and first page
		actions
			.countUsers()
			.then(res => res.json())
			.then(res => {
				data.totalPages = Math.floor(res.count / usersPage) + 1;
				data.currentPage = 1;
				loadData();
			})
			.catch(error => {
				setOnModal({
					status: true,
					msg: "Error cargando datos de usuarios del servidor: " + error,
					fClose: () => handleCloseModal(false)
				});
			});
	}, []);

	const loadData = () => {
		// load n rows of data between data.limInf and data.limSup
		let status = 200;
		actions
			.getUsers(data.limInf, data.limSup)
			.then(res => {
				status = res.status;
				return res.json();
			})
			.then(users => {
				if (status >= 400)
					setOnModal({
						status: true,
						msg: users["msg"],
						fClose: () => handleCloseModal(true)
					});
				else setData({ ...data, users: users });
			})
			.catch(error => {
				setOnModal({
					status: true,
					msg: "Error cargando datos de usuarios del servidor: " + error,
					fClose: () => handleCloseModal(false)
				});
			});
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
		let status = 200;
		// save changes and exit from edit mode
		actions
			.updateUser(inEditMode.rowKey, data.name, data.last_name, data.username, data.email, data.isAdmin)
			.then(res => {
				status = res.status;
				return res.json();
			})
			.then(json => {
				if (status >= 400) setOnModal({ status: true, msg: json["msg"], fClose: () => handleCloseModal(true) });
				else {
					handleCancel();
					loadData();
				}
			})
			.catch(error => {
				setOnModal({
					status: true,
					msg: "Error actualizando datos de usuario en el servidor: " + error,
					fClose: () => handleCloseModal(false)
				});
			});
	};

	const handleDelete = item => {
		let status = 200;
		// delete user
		if (confirm(`¿Eliminar usuario ${item.username}?`)) {
			actions
				.deleteUser(item.id)
				.then(res => {
					status = res.status;
					return res.json();
				})
				.then(json => {
					if (status >= 400)
						setOnModal({ status: true, msg: json["msg"], fClose: () => handleCloseModal(true) });
					else loadData();
				})
				.catch(error => {
					setOnModal({
						status: true,
						msg: "Error eliminando usuario del servidor: " + error,
						fClose: () => handleCloseModal(false)
					});
				});
		}
	};

	const gotoPage = n => {
		if (inEditMode.status) handleCancel();
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
							<th scope="col" width="12%" />
						</tr>
					</thead>
					<tbody>
						{data.users.map(e => (
							<tr key={e.id}>
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
			{onModal.status ? <ModalMsg msg={onModal.msg} closeFunc={handleCloseModal} cancelFunc={null} /> : ""}
		</>
	);
};

// COMPONENT -------------------------------------------------------------------
const Films = () => {
	const { actions } = useContext(Context);

	// variable to show modal messages and function to close modal.
	const [onModal, setOnModal] = useState({ status: false, msg: "" });
	const handleCloseModal = () => setOnModal({ status: false, msg: "" });

	const [data, setData] = useState({
		films: []
	});

	useEffect(() => {
		actions
			.fetchFilms()
			.then(res => res.json())
			.then(films => setData({ ...data, films: films }))
			.catch(error => {
				setOnModal({ status: true, msg: "Error cargando películas del servidor: " + error });
			});
	}, []);

	const datastyle = { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };
	return (
		<>
			{data.films.length > 0 ? (
				<table className="table text-white" style={{ tableLayout: "fixed" }}>
					<thead>
						<tr>
							<th scope="col" width="25%">
								título
							</th>
							<th scope="col" width="15%">
								director
							</th>
							<th scope="col" width="5%">
								año
							</th>
							<th scope="col">descripción</th>
						</tr>
					</thead>
					<tbody>
						{data.films.map((e, i) => (
							<tr key={i}>
								<td style={datastyle}>{e.name}</td>
								<td style={datastyle}>{e.director}</td>
								<td style={datastyle}>{e.year}</td>
								<td style={datastyle}>{e.description}</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				""
			)}
			{onModal.status ? <ModalMsg msg={onModal.msg} closeFunc={handleCloseModal} cancelFunc={null} /> : ""}
		</>
	);
};

// COMPONENT -----------------------------------------------------------------------
const Places = () => {
	const { actions } = useContext(Context);

	// variable to show modal messages and function to close modal.
	const [onModal, setOnModal] = useState({ status: false, msg: "" });
	const handleCloseModal = () => setOnModal({ status: false, msg: "" });

	const [data, setData] = useState({
		places: []
	});
	useEffect(() => {
		actions
			.getPlaces()
			.then(res => res.json())
			.then(places => setData({ ...data, places: places }))
			.catch(error => {
				setOnModal({ status: true, msg: "Error cargando sitios del servidor: " + error });
			});
	}, []);

	const datastyle = { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };

	return (
		<>
			{data.places.length > 0 ? (
				<table className="table text-white" style={{ tableLayout: "fixed" }}>
					<thead>
						<tr>
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
			{onModal.status ? <ModalMsg msg={onModal.msg} closeFunc={handleCloseModal} cancelFunc={null} /> : ""}
		</>
	);
};

// COMPONENT ----------------------------------------------------------------------
export const Admin = () => {
	const { actions } = useContext(Context);

	// variable to show modal messages and functions to close and cancel modal.
	const [onModal, setOnModal] = useState({
		status: false,
		msg: "",
		fClose: null,
		fCancel: null
	});
	const handleCloseModal = bLogout => {
		setOnModal({
			status: false,
			msg: "",
			fClose: null,
			fCancel: null
		});
		if (bLogout) actions.logout();
	};

	const [data, setData] = useState({ opcMenu: 0 });
	// 0 - main page, 1 - users, 2 - films, 3 - places, 7 - download, 8 - load file

	useEffect(() => {
		testToken();
	}, []);

	const testToken = () => {
		let status = 200;
		actions
			.getUser()
			.then(res => {
				status = res.status;
				return res.json();
			})
			.then(responseUser => {
				if (status >= 400)
					setOnModal({
						status: true,
						msg: responseUser["msg"],
						fClose: () => handleCloseModal(true),
						fCancel: null
					});
			})
			.catch(error => {
				setOnModal({
					status: true,
					msg: "Error al cargar datos de usuario: " + error,
					fClose: () => handleCloseModal(true),
					fCancel: null
				});
			});
	};

	const downloadData = () => {
		let status = 200;
		actions
			.getAllData()
			.then(resp => {
				status = resp.status;
				return resp.json();
			})
			.then(data => {
				if (status >= 400)
					setOnModal({ status: true, msg: data["msg"], fClose: () => handleCloseModal(true), fCancel: null });
				else {
					const bblob = new Blob([JSON.stringify(data)]);
					let pp = document.createElement("a");
					pp.setAttribute("href", URL.createObjectURL(bblob));
					pp.setAttribute("download", "data.json");
					pp.click();
					handleCloseModal(false);
				}
			})
			.catch(error => {
				setOnModal({
					status: true,
					msg: "Error cargando datos del servidor: " + error,
					fClose: () => handleCloseModal(false),
					fCancel: null
				});
			});
	};

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark" style={{ position: "fixed" }}>
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
									onClick={() => {
										testToken();
										setData({ opcMenu: 0 });
									}}>
									<i className="fs-4 bi-house" />{" "}
									<span className="ms-1 d-none d-sm-inline">Inicio</span>
								</a>
							</li>
							<li className="nav-item">
								<a
									href="#"
									className="nav-link align-middle px-0 text-white"
									onClick={() => {
										testToken();
										setData({ opcMenu: 1 });
									}}>
									<i className="fs-4 bi-house" />{" "}
									<span className="ms-1 d-none d-sm-inline">Usuarios</span>
								</a>
							</li>
							<li className="nav-item">
								<a
									href="#"
									className="nav-link align-middle px-0 text-white"
									onClick={() => {
										testToken();
										setData({ opcMenu: 2 });
									}}>
									<i className="fs-4 bi-house" />{" "}
									<span className="ms-1 d-none d-sm-inline">Películas</span>
								</a>
							</li>
							<li className="nav-item">
								<a
									href="#"
									className="nav-link align-middle px-0 text-white"
									onClick={() => {
										testToken();
										setData({ opcMenu: 3 });
									}}>
									<i className="fs-4 bi-house" />{" "}
									<span className="ms-1 d-none d-sm-inline">Sitios</span>
								</a>
							</li>
							<li className="nav-item">
								<a
									href="#"
									className="nav-link align-middle px-0 text-white"
									onClick={() => {
										testToken();
										setData({ opcMenu: 7 });
										setOnModal({
											status: true,
											msg: "¿Descargar datos?",
											fClose: downloadData,
											fCancel: () => handleCloseModal(false)
										});
									}}>
									<i className="fs-4 bi-house" />{" "}
									<span className="ms-1 d-none d-sm-inline">Descargar datos</span>
								</a>
							</li>
							<li className="nav-item">
								<a
									href="#"
									className="nav-link align-middle px-0 text-white"
									onClick={() => {
										testToken();
										setData({ opcMenu: 8 });
									}}>
									<i className="fs-4 bi-house" />{" "}
									<span className="ms-1 d-none d-sm-inline">Cargar datos</span>
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

				<div className="col py-3 offset-md-3 offset-xl-2">
					{data.opcMenu == 1 ? (
						<Users params={{ rows: ["id", "name", "lastName"] }} />
					) : data.opcMenu == 2 ? (
						<Films />
					) : data.opcMenu == 3 ? (
						<Places />
					) : data.opcMenu == 8 ? (
						<LoadFile fExit={() => setData({ opcMenu: 0 })} />
					) : (
						""
					)}
				</div>
			</div>
			{onModal.status ? (
				<ModalMsg msg={onModal.msg} closeFunc={onModal.fClose} cancelFunc={onModal.fCancel} />
			) : (
				""
			)}
		</div>
	);
};

// COMPONENT ---------------------------------------------------------------------
const LoadFile = props => {
	const { actions } = useContext(Context);

	const [onModal, setOnModal] = useState({
		status: false,
		msg: "",
		fClose: null,
		fCancel: null
	});
	const handleCloseModal = (bLogout, bExit) => {
		setOnModal({
			status: false,
			msg: "",
			fClose: null,
			fCancel: null
		});
		if (bLogout) actions.logout();
		if (bExit) props.fExit();
	};

	const readFile = async e => {
		let file = e.target.files[0];
		setOnModal({
			status: true,
			msg: "Todos los datos anteriores serán eliminados. ¿Cargar nuevos datos?",
			fClose: loadJsonFile, // load the file
			fCancel: () => handleCloseModal(false, true)
		});

		function loadJsonFile() {
			let myfile = new FileReader();
			myfile.onload = function(e) {
				let content = e.target.result;
				actions
					.setAllData(content)
					.then(resp => resp.json())
					.then(data =>
						setOnModal({
							status: true,
							msg: data["msg"],
							fClose: () => handleCloseModal(true, false),
							fCancel: null
						})
					)
					.catch(error =>
						setOnModal({
							status: true,
							msg: "Error escribiendo datos en el servidor: " + error,
							fClose: () => handleCloseModal(true, false),
							fCancel: null
						})
					);
			};
			myfile.readAsText(file);
		}
	};

	return (
		<>
			<input type="file" id="file-input" onChange={readFile} />
			{onModal.status ? (
				<ModalMsg msg={onModal.msg} closeFunc={onModal.fClose} cancelFunc={onModal.fCancel} />
			) : (
				""
			)}
		</>
	);
};

LoadFile.protoTypes = {
	fExit: PropTypes.func
};
