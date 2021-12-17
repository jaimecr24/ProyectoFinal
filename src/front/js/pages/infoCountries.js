import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Country } from "../component/country";

export const InfoCountries = () => {
	const [infoCountries, setInfoCountries] = useState({});
	const [scenesByFilm, setScenesByFilm] = useState({});
	const params = useParams();
	const getInfoCountries = id => {
		fetch(process.env.BACKEND_URL + "/api/countries/" + id)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				setInfoCountries(data);
			})
			.then(id => getActions().getScenesByFilm(id))
			.catch(error => console.log("Error loading place from backend", error));
	};
	const getScenesByFilm = id => {
		fetch(process.env.BACKEND_URL + "/api/scenes/film/" + id)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				setScenesByFilm(data);
			})
			.catch(error => console.log("Error loading place from backend", error));
	};
	useEffect(() => {
		getInfoCountries(params.theid);
		getScenesByFilm(params.theid);
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
					{scenesByFilm.length > 0 ? (
						<div className="container-fluid content-row">
							<h5 style={{ paddingBottom: "10px", paddingTop: "30px" }}>
								·Películas que fueron grabadas en este país:
							</h5>
							<div className="my-card-content">
								<div className="infocards row col-auto">
									{scenesByFilm.map((item, index) => {
										return (
											<Country
												id={item.idFilm}
												description={item.description}
												movie={item.movie}
												picture={item.picture}
												key={item.idFilm}
												filmPhoto={item.filmPhoto}
											/>
										);
									})}
								</div>
							</div>
						</div>
					) : null}
				</div>
			) : null}
		</div>
	);
};
