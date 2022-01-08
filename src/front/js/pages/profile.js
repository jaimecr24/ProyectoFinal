import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/modal.css";
import usericon from "../../img/users.png";
import Map from "../component/map.js";

export const Profile = () => {
	const { store, actions } = useContext(Context);

	const [data, setData] = useState({
		name: "",
		lastName: "",
		username: "",
		email: "",
		lastTime: null,
		listItems: [],
		markerPositions: []
	});

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
		let status = 0;
		actions
			.getUser()
			.then(res => {
				status = res.status;
				return res.json();
			})
			.then(user => {
				if (status >= 400) {
					alert(user["msg"]);
					actions.logout();
				} else loadFavPlaces(user);
			})
			.catch(error => console.error("Error:", error));
	}, []);

	const loadFavPlaces = user => {
		actions
			.getFavPlaces()
			.then(res => res.json())
			.then(responsePlaces => {
				setData({
					name: user.name,
					lastName: user.last_name,
					username: user.username,
					email: user.email,
					lastTime: new Date(store.activeUser.lastTime).toLocaleString(),
					listItems: responsePlaces.items,
					markerPositions: actions.getMarkerPositions(responsePlaces.items)
				});
			})
			.catch(error => console.error("Error:", error));
	};

	const handleDelete = async e => {
		let id = parseInt(e.target.getAttribute("datakey"));
		try {
			let res = await actions.delFavPlace(id);
			if (res.ok) {
				loadFavPlaces({
					name: data.name,
					last_name: data.lastName,
					username: data.username,
					email: data.email
				});
			} else {
				let response = await res.json();
				alert(response["msg"]);
				actions.logout();
			}
		} catch (error) {
			alert(error);
		}
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
							Nombre:{" "}
							<span className="profile" style={dataStyle}>
								{data.name}
							</span>
						</div>
						<div className="mt-2 fs-5">
							Apellidos:{" "}
							<span className="profile" style={dataStyle}>
								{data.lastName}
							</span>
						</div>
						<div className="mt-2 fs-5">
							E-mail:{" "}
							<span className="profile" style={dataStyle}>
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
				<div className="fs-3 col-5 offset-1">
					{`Tus lugares favoritos: ${data["listItems"] ? data["listItems"].length : 0}`}
				</div>
				<div className="row mt-2">
					<div className="col-10 offset-1" id="favList">
						{data["listItems"]
							? data["listItems"].map(value => (
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

				{data.markerPositions.length > 0 ? (
					<div className="mt-5">
						<h3 className="text-light text-center">Encuentra todos tus sitios favoritos:</h3>
						<div className="mt-5 bg-danger mx-auto" style={{ width: "900px" }}>
							<Map markers={data.markerPositions} zoom={2} width="900" height="600" />
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
};
