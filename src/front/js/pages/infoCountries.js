import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { FilmCountry } from "../component/filmCountry";
import Map from "../component/map.js";

export const InfoCountries = () => {
	const params = useParams();
	const { actions } = useContext(Context);

	const [data, setData] = useState({ infoCountry: null, films: [] });
	const [markerPositions, setMarkerPositions] = useState([]);

	useEffect(() => {
		// Get info of country
		actions
			.getInfoCountries(params.theid)
			.then(res => res.json())
			.then(mycountry => {
				// Get info of films filmmed on country
				actions
					.getFilmsByCountry(params.theid)
					.then(res => res.json())
					.then(myfilms => setData({ infoCountry: mycountry, films: myfilms }))
					.catch(error => alert("Error loading films from backend: " + error));
				// Get info of places of country where a film is filmmed.
				actions
					.getPlacesByCountry(params.theid)
					.then(res => res.json())
					.then(data => setMarkerPositions(actions.getMarkerPositions(data)))
					.catch(error => alert("Error loading places from backend: " + error));
			})
			.catch(error => alert("Error loading country from backend: " + error));
	}, []);

	return (
		<div
			className="container mt-3 mx-auto bg-dark p-3 card rounded"
			style={{ width: "75%", color: "white", borderColor: "#fa9f42" }}>
			{data.infoCountry ? (
				<div>
					<h2 className="text" style={{ color: "#fa9f42", marginLeft: "30px" }}>
						{data.infoCountry.name}
					</h2>
					<div className="row mx-3 px-3">
						<div className="row col-5 me-5">
							<img
								className="rounded row"
								src={data.infoCountry.urlFlag}
								alt="..."
								style={{ minHeight: "200px", objectFit: "cover", paddingTop: "10px" }}
							/>
						</div>
						<div className="col-6">
							<p className="text-white">{data.infoCountry.description}</p>
						</div>
					</div>
					{data.films.length > 0 ? (
						<div className="container-fluid content-row">
							<h5 style={{ paddingBottom: "10px", paddingTop: "30px" }}>
								·Películas grabadas en este país:
							</h5>
							<div className="my-card-content">
								{data.films.map((item, index) => {
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
					{markerPositions.length > 0 ? (
						<div className="row mt-5 mx-3 px-3" style={{ paddingTop: "10px" }}>
							<h5>Encuentra todos los sitios de rodaje en {data.infoCountry.name}:</h5>

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
			) : (
				""
			)}
		</div>
	);
};
