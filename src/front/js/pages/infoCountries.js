import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";
import { FilmCountry } from "../component/filmCountry";
import Map from "../component/map.js";

export const InfoCountries = () => {
	const { actions } = useContext(Context);
	const [infoCountries, setInfoCountries] = useState({});
	const [filmsByCountry, setFilmsByCountry] = useState({});
	const [markerPositions, setMarkerPositions] = useState(null);
	const params = useParams();
	const getInfoCountries = id => {
		fetch(process.env.BACKEND_URL + "/api/countries/" + id)
			.then(res => res.json())
			.then(data => {
				setInfoCountries(data);
			})
			.then(() => getActions().getFilmsByFilm(id))
			.catch(error => console.log("Error loading place from backend", error));
	};
	const getFilmsByCountry = id => {
		fetch(process.env.BACKEND_URL + "/api/films/country/" + id)
			.then(res => res.json())
			.then(data => {
				setFilmsByCountry(data);
			})
			.catch(error => console.log("Error loading place from backend", error));
	};
	const getPlacesByCountry = id => {
		fetch(process.env.BACKEND_URL + "/api/places/country/" + id)
			.then(res => res.json())
			.then(data => {
				setMarkerPositions(actions.getMarkerPositions(data));
			})
			.catch(error => console.log("Error loading place from backend", error));
	};
	useEffect(() => {
		getInfoCountries(params.theid);
		getFilmsByCountry(params.theid);
		getPlacesByCountry(params.theid);
	}, []);

	return (
		<div
			className="container mt-3 mx-auto bg-dark p-3 card rounded"
			style={{ width: "75%", color: "white", borderColor: "#fa9f42" }}>
			{infoCountries ? (
				<div>
					<h2 className="text" style={{ color: "#fa9f42", marginLeft: "30px" }}>
						{infoCountries.name}
					</h2>
					<div className="row mx-3 px-3">
						<div className="row col-5 me-5">
							<img
								className="rounded row"
								src={infoCountries.urlFlag}
								alt="..."
								style={{ minHeight: "200px", objectFit: "cover", paddingTop: "10px" }}
							/>
						</div>
						<div className="col-6">
							<p className="text-white">{infoCountries.description}</p>
						</div>
					</div>
					{filmsByCountry.length > 0 ? (
						<div className="container-fluid content-row">
							<h5 style={{ paddingBottom: "10px", paddingTop: "30px" }}>
								·Películas que fueron grabadas en este país:
							</h5>
							<div className="my-card-content">
								{filmsByCountry.map((item, index) => {
									return (
										<div
											className="infocards row col-auto"
											key={index}
											style={{ margin: "10px", width: "15 rem", borderRadius: "50px" }}>
											<FilmCountry
												id={item.id}
												movie={item.name}
												key={item.idFilm}
												filmPhoto={item.urlPhoto}
											/>
										</div>
									);
								})}
							</div>
						</div>
					) : null}
					{markerPositions && markerPositions.length > 0 ? (
						<div className="row mt-5 mx-3 px-3" style={{ paddingTop: "10px" }}>
							<h5>Encuentra todos los sitios de rodaje en {infoCountries.name}:</h5>

							<div className="row">
								<div className="d-flex justify-content-center" style={{ paddingTop: "10px" }}>
									<Map markers={markerPositions} zoom={5} width="800" height="500" />
								</div>
							</div>
						</div>
					) : (
						""
					)}
				</div>
			) : null}
		</div>
	);
};
