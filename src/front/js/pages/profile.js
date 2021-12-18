import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/modal.css";
import usericon from "../../img/users.png";

export const Profile = () => {
	const { store, actions } = useContext(Context);

	const [data, setData] = useState({
		name: "",
		lastName: "",
		username: "",
		email: "",
		lastTime: null,
		listItems: []
	});

	let itemsChecked = 0;
	let history = useHistory();
	const linkStyle = { color: "white" };

	useEffect(() => {
		let status = 0;
		document.getElementById("btnDel").disabled = itemsChecked < 1;
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
				} else
					actions
						.getFavPlaces()
						.then(res => res.json())
						.then(responsePlaces => {
							setData({
								name: responseUser.name,
								lastName: responseUser.last_name,
								username: responseUser.username,
								email: responseUser.email,
								lastTime: new Date(store.activeUser.lastTime).toLocaleString(),
								listItems: responsePlaces.items
							});
						})
						.catch(error => console.error("Error:", error));
			})
			.catch(error => console.error("Error:", error));
	}, []);

	const handleCheckBox = e => {
		// Disable btnDel if itemsChecked<1 or enable it if itemsChecked>=1
		let btn = document.getElementById("btnDel");
		if (e.target.checked) {
			itemsChecked++;
			if (itemsChecked == 1) {
				btn.disabled = false;
				btn.style.color = "white";
			}
		} else {
			itemsChecked--;
			if (itemsChecked == 0) {
				btn.disabled = true;
				btn.style.color = "gray";
			}
		}
	};

	async function handleDeleteFav(e) {
		let btn = document.getElementById("btnDel");
		let list = document.getElementById("favList");
		let newlistitems = data.listItems;
		try {
			for (let i = 0; i < list.childElementCount; i++) {
				if (list.childNodes[i].firstChild.checked) {
					let id = parseInt(list.childNodes[i].getAttribute("datakey"));
					let res = await actions.delFavPlace(id); // await to wait promise is completed.
					//let resj = await res.json();  ---- Here not necessary -----
					if (res.ok) {
						newlistitems = newlistitems.filter(e => e["id"] != id);
						itemsChecked--;
						if (itemsChecked == 0) {
							btn.disabled = true;
							btn.style.color = "gray";
						}
					} else {
						// Show error and exit from loop
						response = await res.json();
						alert(response["msg"]);
						actions.logout();
						i = list.childElementCount; // Force exit loop
					}
				}
			}
			// Finally we update the listItems in data to render new list of favorites.
			setData({ ...data, listItems: newlistitems });
		} catch (error) {
			console.log("Error: ", error);
		}
	}

	return (
		<div
			className="container bg-dark design-card text-white mt-4 pt-5 profile mx-auto"
			style={{ border: "1px solid #fa9f42" }}>
			<div className="fs-2 ps-3">{`Bienvenido, ${data.username}`}</div>
			<div className="row">
				<div className="col-5 offset-1">
					<div className="mt-4">
						<div className="fs-3 border-bottom border-light pb-1">Tus datos</div>
						<div className="mt-3">{`Nombre: ${data.name}`}</div>
						<div className="mt-2">{`Apellidos: ${data.lastName}`}</div>
						<div className="mt-2">{`Email: ${data.email}`}</div>
						<div className="mt-2">{`Último inicio de sesión: ${data.lastTime}`}</div>
					</div>
				</div>
				<div className="col-5 mt-5 align-items-center" align="center">
					<img src={usericon} width="180px" />
				</div>
			</div>

			<div className="py-5">
				<div className="row">
					<div className="fs-3 col-5 offset-1">
						{`Lugares favoritos: ${data["listItems"] ? data["listItems"].length : 0}`}
					</div>
					<button
						id="btnDel"
						className="col-2 offset-3 fs-5"
						style={{ background: "#fa9f42", color: "lightgray" }}
						onClick={handleDeleteFav}>
						Eliminar
					</button>
				</div>
				<div className="row mt-2">
					<div className="col-10 offset-1" id="favList">
						{data["listItems"]
							? data["listItems"].map(value => (
									<div
										key={value.id}
										datakey={value.id}
										className="row border-top border-light py-1 align-items-center">
										<input
											className="col-1"
											type="checkbox"
											style={{ width: "20px", height: "20px" }}
											onClick={handleCheckBox}
										/>
										<img className="col-2" src={value.urlPhoto} />
										<div className="col-4">
											<Link to={"/place/" + value.id} style={linkStyle}>
												{value.name}
											</Link>
											{" (" + value.countryName + ")"}
										</div>
										<div className="col-5">{value.description}</div>
									</div>
							  ))
							: ""}
					</div>
				</div>
			</div>
			<div className="w-100 row">
				<button
					className="col-auto px-3 mb-3 mx-auto fs-5"
					type="button"
					style={{ background: "#fa9f42", color: "white" }}
					onClick={() => history.goBack()}>
					Cerrar
				</button>
			</div>
		</div>
	);
};
