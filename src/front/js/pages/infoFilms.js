import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";
import { Movie } from "../component/movie";
import Map from "../component/map.js";

export const InfoFilms = () => {
	const { actions } = useContext(Context);
	const [infoFilm, setInfoFilm] = useState(null);
	const [scenesByFilm, setScenesByFilm] = useState([]);
	const [markerPositions, setMarkerPositions] = useState([]);
	const params = useParams();

	useEffect(() => {
		// load info of film
		actions
			.getInfoFilm(params.theid)
			.then(res => res.json())
			.then(data => {
				setInfoFilm(data);
				// load info of scenes
				actions
					.getScenesByFilm(params.theid)
					.then(res => res.json())
					.then(data => {
						// filter scenes with idPlace repeated.
						let listIdPlaces = new Set();
						let filteredData = data.filter(e => {
							let isRepeated = listIdPlaces.has(e.idPlace);
							listIdPlaces.add(e.idPlace);
							return !isRepeated;
						});
						setScenesByFilm(filteredData);
					})
					.catch(error => alert("Error loading scenes from backend: " + error));
				// load info of places for markerPositions of map.
				actions
					.getPlacesByFilm(params.theid)
					.then(res => res.json())
					.then(data => setMarkerPositions(actions.getMarkerPositions(data)))
					.catch(error => alert("Error loading places from backend: " + error));
			})
			.catch(error => alert("Error loading film from backend: " + error));
	}, []);

	return (
		<div
			className="container mt-3 mx-auto bg-dark p-3 card rounded"
			style={{ width: "75%", color: "white", borderColor: "#fa9f42" }}>
			{infoFilm ? (
				<div>
					<h2 className="text" style={{ color: "#fa9f42", marginLeft: "30px" }}>
						{infoFilm.name}
					</h2>
					<div className="row mx-3 px-3">
						<div className="row col-5 me-5">
							<img
								className="rounded row"
								src={infoFilm.urlPhoto}
								alt="..."
								style={{ minHeight: "200px", objectFit: "cover", paddingTop: "10px" }}
							/>
						</div>
						<div className="col-6">
							<p style={{ color: "#fa9f42" }}>
								{infoFilm.director}, {infoFilm.year}
							</p>
							<p className="text-white">{infoFilm.description}</p>
						</div>
					</div>
					{scenesByFilm.length > 0 ? (
						<div className="container-fluid content-row">
							<h5 style={{ paddingBottom: "10px", paddingTop: "30px" }}>
								·Sitios donde se ha grabado esta película:
							</h5>
							<div className="my-card-content">
								{scenesByFilm.map((item, index) => {
									return (
										<div
											className="infocards row col-auto"
											key={index}
											style={{
												margin: "10px",
												width: "15 rem",
												borderRadius: "50px",
												paddingRight: "10px"
											}}>
											<Movie
												id={item.idPlace}
												place={item.place}
												country={item.country}
												urlPhoto={item.urlPhoto}
												picture={item.picture}
												key={item.idPlace}
											/>
										</div>
									);
								})}
							</div>
						</div>
					) : null}
					{markerPositions.length > 0 ? (
						<div className="row mt-5 mx-3 px-3" style={{ paddingTop: "10px" }}>
							<h5>Encuentra todos los sitios en los que se ha rodado {infoFilm.name}:</h5>

							<div className="row">
								<div className="d-flex justify-content-center" style={{ paddingTop: "10px" }}>
									<Map
										markers={markerPositions}
										zoom={2}
										width="800"
										height="500"
										center={{ lat: 40.416775, lng: 3.70379 }}
									/>
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
