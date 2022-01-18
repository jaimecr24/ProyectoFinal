import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/modal.css";
import usericon from "../../img/users.png";
import Map from "../component/map.js";
import ModalMsg from "../component/modalmsg";

export const Profile = () => {
	const { store, actions } = useContext(Context);

	// variable to show modal messages and function to close modal.
	const [onModal, setOnModal] = useState({ status: false, msg: "", fClose: null });
	const handleCloseModal = () => setOnModal({ status: false, msg: "", fClose: null });

	const [data, setData] = useState({
		name: "",
		lastName: "",
		username: "",
		email: "",
		lastTime: null
	});

	const [fav, setFav] = useState({ places: [], markerPositions: [] });

	let history = useHistory();
	const linkStyle = { color: "white" };
	const dataStyle = {
		height: "20px",
		background: "rgba(255, 255, 255, 0.9)",
		color: "black",
		padding: "5px",
		borderRadius: "5px"
	};

	useEffect(() => {
		loadUser();
		loadPlaces();
	}, []);

	const loadUser = async () => {
		try {
			let res = await actions.getUser(); // Get data of current user
			let resj = await res.json();
			if (res.status >= 400) {
				setOnModal({ status: true, msg: resj["msg"], fClose: () => handleCloseModal(true) });
			} else {
				setData({
					name: resj.name,
					lastName: resj.last_name,
					username: resj.username,
					email: resj.email,
					lastTime: new Date(store.activeUser.lastTime).toLocaleString()
				});
			}
		} catch (error) {
			setOnModal({
				status: true,
				msg: "Error cargando datos de usuario del servidor: " + error,
				fClose: () => handleCloseModal(false)
			});
		}
	};

	const loadPlaces = async () => {
		try {
			let p = await actions.getFavPlaces();
			let places = await p.json();
			// order places by name
			places.items.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
			setFav({
				places: places.items,
				markerPositions: actions.getMarkerPositions(places.items)
			});
		} catch (error) {
			setOnModal({
				status: true,
				msg: "Error cargando datos de sitios del servidor: " + error,
				fClose: () => handleCloseModal(false)
			});
		}
	};

	const handleDelete = async e => {
		let id = parseInt(e.target.getAttribute("datakey"));
		// If we don't wait for delFavPlace, the call to loadPlaces don't show the changes.
		// For this delFavPlace is implemented as an async func in flux.js
		let res = await actions.delFavPlace(id);
		loadPlaces();
	};

	return (
		<div className="container bg-dark text-white mt-4 mx-auto p-0" style={{ border: "1px solid #fa9f42" }}>
			<button
				type="button"
				className="btn btn-warning float-end m-0 rounded-0 profile"
				onClick={() => history.goBack()}>
				X
			</button>
			<div className="fs-2 ps-4 mt-5">
				<span>{`Bienvenido, ${data.username}`}</span>
			</div>
			<div className="row">
				<div className="col-5 offset-1">
					<div className="mt-4">
						<div className="fs-3 border-bottom border-light pb-1">Tus datos</div>
						<div className="mt-3 fs-5">
							<span className="me-3">Nombre:</span>
							<span className="profile ms-5" style={dataStyle}>
								{data.name}
							</span>
						</div>
						<div className="mt-2 fs-5">
							<span className="me-3">Apellidos:</span>
							<span className="profile ms-4" style={dataStyle}>
								{data.lastName}
							</span>
						</div>
						<div className="mt-2 fs-5">
							<span className="me-4">E-mail:</span>
							<span className="profile ms-5" style={dataStyle}>
								{data.email}
							</span>
						</div>
						<div className="mt-2 fs-5">
							Última visita:{" "}
							<span className="profile" style={dataStyle}>
								{data.lastTime}
							</span>
						</div>
					</div>
				</div>
				<div className="col-5 mt-5 align-items-center" align="center">
					<img src={usericon} width="180px" />
				</div>
			</div>

			<div className="py-5">
				<div className="fs-3 col-5 offset-1">Tus lugares favoritos:</div>
				<div className="row mt-2">
					<div className="col-10 offset-1" id="favList">
						{fav.places.length > 0
							? fav.places.map(value => (
									<div
										key={value.id}
										datakey={value.id}
										className="row border-top border-light py-1 align-items-center">
										<button
											datakey={value.id}
											className="col-1 bg-danger text-white fs-5 p-0"
											style={{ width: "35px", height: "32px" }}
											onClick={handleDelete}>
											X
										</button>
										<img className="col-3" src={value.urlPhoto} />
										<div className="col-3 fs-5">
											<Link to={"/place/" + value.id} style={linkStyle}>
												{value.name}
											</Link>
											{" (" + value.countryName + ")"}
										</div>
										<div className="col profile">{value.description}</div>
									</div>
							  ))
							: ""}
					</div>
				</div>

				{fav.markerPositions.length > 0 ? (
					<div className="mt-5">
						<h3 className="text-light text-center">Encuentra todos tus sitios favoritos:</h3>
						<div className="mt-5 bg-danger mx-auto" style={{ width: "900px" }}>
							<Map
								markers={fav.markerPositions}
								zoom={2}
								width="900"
								height="600"
								center={{ lat: 40.416775, lng: 3.70379 }}
							/>
						</div>
					</div>
				) : null}
			</div>
			{onModal.status ? <ModalMsg msg={onModal.msg} closeFunc={onModal.fClose} cancelFunc={null} /> : ""}
		</div>
	);
};
