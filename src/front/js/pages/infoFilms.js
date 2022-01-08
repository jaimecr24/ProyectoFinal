import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";
import { Movie } from "../component/movie";
import Map from "../component/map.js";

export const InfoFilms = () => {
	const { actions } = useContext(Context);
	const [infoFilms, setInfoFilms] = useState({});
	const [scenesByFilm, setScenesByFilm] = useState({});
	const [markerPositions, setMarkerPositions] = useState(null);
	const params = useParams();
	const getInfoFilms = id => {
		fetch(process.env.BACKEND_URL + "/api/films/" + id)
			.then(res => res.json())
			.then(data => {
				setInfoFilms(data);
			})
			.then(id => getActions().getScenesByFilm(id))
			.catch(error => console.log("Error loading place from backend", error));
	};
	const getScenesByFilm = id => {
		fetch(process.env.BACKEND_URL + "/api/scenes/film/" + id)
			.then(res => res.json())
			.then(data => {
				setScenesByFilm(data);
			})
			.catch(error => console.log("Error loading place from backend", error));
	};
	const getPlacesByFilm = id => {
		fetch(process.env.BACKEND_URL + "/api/places/film/" + id)
			.then(res => res.json())
			.then(data => {
				setMarkerPositions(actions.getMarkerPositions(data));
			})
			.catch(error => console.log("Error loading place from backend", error));
	};

	useEffect(() => {
		getInfoFilms(params.theid);
		getScenesByFilm(params.theid);
		getPlacesByFilm(params.theid);
	}, []);

	useEffect(
		() => {
			markerPositions ? console.log(markerPositions) : null;
		},
		[markerPositions]
	);

	return (
		<div
			className="container mt-3 mx-auto bg-dark p-3 card rounded"
			style={{ width: "75%", color: "white", borderColor: "#fa9f42" }}>
			{infoFilms ? (
				<div>
					<h2 className="text" style={{ color: "#fa9f42", marginLeft: "30px" }}>
						{infoFilms.name}
					</h2>
					<div className="row mx-3 px-3">
						<div className="row col-5 me-5">
							<img
								className="rounded row"
								src={infoFilms.urlPhoto}
								alt="..."
								style={{ minHeight: "200px", objectFit: "cover", paddingTop: "10px" }}
							/>
						</div>
						<div className="col-6">
							<p className="text-white">{infoFilms.description}</p>
						</div>
					</div>
					{scenesByFilm.length > 0 ? (
						<div className="container-fluid content-row">
							<h5 style={{ paddingBottom: "10px", paddingTop: "30px" }}>
								·Sitios grabados en esta película:
							</h5>
							<div className="my-card-content">
								{scenesByFilm.map((item, index) => {
									return (
										<div
											className="infocards row col-auto"
											key={index}
											style={{ margin: "10px", width: "15 rem", borderRadius: "50px" }}>
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
					{markerPositions && markerPositions.length > 0 ? (
						<div className="row mt-5 mx-3 px-3" style={{ paddingTop: "10px" }}>
							<h5>Encuentra todos los sitios en los que se ha rodado {infoFilms.name}:</h5>

							<div className="row">
								<div className="d-flex justify-content-center" style={{ paddingTop: "10px" }}>
									<Map markers={markerPositions} zoom={2} width="800" height="500" />
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
