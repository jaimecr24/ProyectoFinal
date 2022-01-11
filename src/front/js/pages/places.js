import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Places = () => {
	const { actions, store } = useContext(Context);
	const [places, setPlaces] = useState([]);

	useEffect(() => {
		actions
			.getPlaces()
			.then(resp => resp.json())
			.then(data => setPlaces(data))
			.catch(error => console.log("Error loading places from backend", error));
	}, []);

	const isLiked = idPlace => store.activeUser.listFav.includes(idPlace);
	const handleLike = idPlace => {
		isLiked(idPlace) ? actions.delFavPlace(idPlace) : actions.addFavPlace(idPlace);
	};

	return (
		<div className="container-fluid content-row">
			<div className="title" style={{ textAlign: "center", paddingBottom: "5px" }}>
				<h1 style={{ color: "#fa9f42" }}>Sitios de rodaje</h1>
				<span style={{ color: "white" }}>Descubre nuestro listado de lugares de rodaje!</span>
			</div>
			<div className="my-card-content">
				{places.map((item, index) => {
					return (
						<div
							className="infocards row col-auto"
							style={{ margin: "10px", width: "15 rem", borderRadius: "50px" }}
							key={index}>
							<div className="design-card bg-dark">
								<img
									src={item.urlPhoto}
									className="characters card-img-top mx-auto"
									alt={item.name}
									style={{ objectFit: "cover", width: "100%" }}
								/>
								<div className="card-body">
									<h5
										className="card-title card-title-text"
										style={{
											textAlign: "center",
											paddingBottom: "40px",
											color: "#fa9f42"
										}}>
										{item.name}
									</h5>

									<Link to={"/place/" + item.id}>
										<span className="btn btn-outline">Aprender más</span>
									</Link>
									{store.activeUser.id ? (
										<span
											className="btn btn-outline-danger ms-1"
											onClick={() => handleLike(item.id)}>
											{isLiked(item.id) ? (
												<i className="fas fa-heart" />
											) : (
												<i className="far fa-heart" />
											)}
										</span>
									) : null}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
