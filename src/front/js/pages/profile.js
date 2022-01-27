import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/modal.css";
import Map from "../component/map.js";
import ModalMsg from "../component/modalmsg";

export const Profile = () => {
	const { store, actions } = useContext(Context);

	// variable to show modal messages and function to close modal.
	const [onModal, setOnModal] = useState({ status: false, msg: "", fClose: null });
	const handleCloseModal = bLogout => {
		setOnModal({ status: false, msg: "", fClose: null, fCancel: null });
		if (bLogout) actions.logout(); // close user session
	};

	const [data, setData] = useState({
		mywidth: 0,
		name: "",
		lastName: "",
		username: "",
		email: "",
		lastTime: null
	});

	const [fav, setFav] = useState({ places: [], markerPositions: [] });

	let history = useHistory();
	const linkStyle = { color: "white" };

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		try {
			let res = await actions.getUser(); // Get data of current user
			let resj = await res.json();
			if (res.status >= 400) {
				setOnModal({ status: true, msg: resj["msg"], fClose: () => handleCloseModal(true) });
			} else {
				setData({
					mywidth: window.innerWidth,
					name: resj.name,
					lastName: resj.last_name,
					username: resj.username,
					email: resj.email,
					lastTime: new Date(store.activeUser.lastTime).toLocaleString()
				});
				loadPlaces();
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
			if (places.items) places.items.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
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

	// Set the atribute mywidth, to adjust size of map.
	window.onresize = () => setData({ ...data, mywidth: window.innerWidth });

	return (
		<div
			className="container bg-dark text-light mt-5 mx-auto p-0 rounded border-one"
			style={{ minHeight: window.innerHeight - 190 }}>
			<button
				type="button"
				className="btn btn-dark bg-one color-two float-end m-0 rounded"
				onClick={() => history.goBack()}>
				X
			</button>
			<div className="fs-2 ps-4 mt-4">{`Bienvenido, ${data.username}`}</div>
			<div className="fs-5 mt-3 ms-5 ms-xs-3">
				<div className="row">
					<div className="mt-2 col-lg-2 col-sm-4">Nombre:</div>
					<div className="mt-2 col-lg-4 col-sm-auto bg-light p-1 color-two rounded">{data.name}</div>
				</div>
				<div className="row">
					<div className="mt-2 col-lg-2 col-sm-4">Apellidos:</div>
					<div className="mt-2 col-lg-4 col-sm-auto bg-light p-1 color-two rounded">{data.lastName}</div>
				</div>
				<div className="row">
					<div className="mt-2 col-lg-2 col-sm-4">E-mail:</div>
					<div className="mt-2 col-lg-4 col-sm-auto bg-light p-1 color-two rounded">{data.email}</div>
				</div>
				<div className="row">
					<div className="mt-2 col-lg-2 col-sm-4">Última visita:</div>
					<div className="mt-2 col-lg-4 col-sm-auto bg-light p-1 color-two rounded">{data.lastTime}</div>
				</div>
			</div>
			<div className="fs-3 col-5 pt-5 ms-5">Tus lugares favoritos:</div>
			<div className="mx-5 mt-2 row">
				<div className="col-12" id="favList">
					{fav.places.length > 0
						? fav.places.map(value => (
								<div
									key={value.id}
									datakey={value.id}
									className="row border-top border-light py-2 align-items-center">
									<button
										type="button"
										datakey={value.id}
										className="col-1 my-3 btn btn-dark bg-one rounded color-two p-0"
										style={{ width: "35px", height: "32px" }}
										onClick={handleDelete}>
										<i className="fa fa-trash" aria-hidden="true" datakey={value.id} />
									</button>
									<img className="col-lg-3 col-sm-4" src={value.urlPhoto} />
									<div className="col-lg-3 col-sm-4 fs-5">
										<Link to={"/place/" + value.id} style={linkStyle}>
											{value.name}
										</Link>
										{" (" + value.countryName + ")"}
									</div>
									<div className="col">{value.description}</div>
								</div>
						  ))
						: ""}
				</div>
			</div>
			{fav.markerPositions.length > 0 ? (
				<div className="mx-auto mt-5 pt-3 mb-5">
					<h3 className="text-light title-one text-center">Encuentra todos tus sitios favoritos:</h3>
					<div className="card rounded mb-3 mx-auto" style={{ width: "max-content" }}>
						<Map
							markers={fav.markerPositions}
							zoom={2}
							width={Math.floor(data.mywidth * 0.58)}
							height={Math.floor(data.mywidth * 0.3)}
							center={{ lat: 40.416775, lng: 3.70379 }}
						/>
					</div>
				</div>
			) : null}
			{onModal.status ? <ModalMsg msg={onModal.msg} closeFunc={onModal.fClose} cancelFunc={null} /> : ""}
		</div>
	);
};
