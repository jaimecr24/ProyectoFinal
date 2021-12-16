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
		<div>
			{infoCountries ? (
				<div>
					<h2
						style={{
							color: "white",
							fontFamily: "Permanent Marker",
							fontStyle: "cursive",
							paddingBottom: "20px",
							textAlign: "center",
							paddingBottom: "20px"
						}}>
						{infoCountries.name}
					</h2>
					<div className="my-img col-md-6">
						<img
							className="bg-dark rounded row ms-2"
							src={infoCountries.urlFlag}
							alt="..."
							style={{
								height: "300px"
							}}
						/>
					</div>
					<div>
						<p
							style={{
								color: "white",
								paddingBottom: "20px",
								paddingTop: "20px",
								textAlign: "center"
							}}>
							{infoCountries.description}
						</p>
					</div>
					<div>
						<div>
							<h2
								style={{
									color: "white",
									paddingBottom: "20px",
									paddingTop: "20px"
								}}>
								{" "}
								·Películas que fueron grabadas en este país:{" "}
							</h2>
						</div>
					</div>
					<div className="my-card-content">
						<div className="row col-auto" style={{ margin: "10px", width: "15 rem", borderRadius: "50px" }}>
							{scenesByFilm.length > 0
								? scenesByFilm.map((item, index) => {
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
								  })
								: null}
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
};
