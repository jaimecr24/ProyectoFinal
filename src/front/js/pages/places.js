import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Places = () => {
	const { actions, store } = useContext(Context);
	const [places, setPlaces] = useState([]);
	const getPlaces = () => {
		fetch(process.env.BACKEND_URL + "/api/places")
			.then(resp => resp.json())
			.then(data => setPlaces(data))
			.catch(error => console.log("Error loading places from backend", error));
	};

	useEffect(() => {
		getPlaces();
	}, []);

	return (
		<div className="container">
			<h2 className="text-center py-3 text-light">Sitios de rodaje</h2>
			<div className="row d-flex  justify-content-between">
				{places
					? places.map((value, index) => {
							return (
								<div
									className="card px-0 mx-4 col rounded col-3 mb-5 py-0"
									key={index}
									style={{ minWidth: "350px" }}>
									<img
										className="card-img-top mt-0"
										src={value.urlPhoto}
										alt="..."
										style={{ height: "200px" }}
									/>
									<div className="card-body">
										<div>
											<h5 className="card-title text-success text-center">{value.name}</h5>
											<div style={{ fontSize: "10px" }}>
												<div className="text-dark">{value.description}</div>
											</div>

											<div>
												<Link to={"/place/" + value.id}>
													<span className="btn btn-outline-success">Ver</span>
												</Link>

												{store.activeUser.id ? (
													<span
														className="btn border rounded ms-1"
														onClick={() => actions.addFavPlace(value.id)}>
														<i className="fas fa-film" />
													</span>
												) : null}
											</div>
										</div>
									</div>
								</div>
							);
					  })
					: "Cargando"}
			</div>
		</div>
	);
};
