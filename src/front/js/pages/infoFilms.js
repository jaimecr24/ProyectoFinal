import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Movie } from "../component/movie";

export const InfoFilms = () => {
	const [infoFilms, setInfoFilms] = useState({});
	const [scenesByFilm, setScenesByFilm] = useState({});
	const params = useParams();
	const getInfoFilms = id => {
		fetch(process.env.BACKEND_URL + "/api/films/" + id)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				setInfoFilms(data);
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
		getInfoFilms(params.theid);
		getScenesByFilm(params.theid);
	}, []);

	return (
		<div>
			{infoFilms ? (
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
						{infoFilms.name}
					</h2>
					<div className="my-img col-md-6" style={{ justifyContent: "center" }}>
						<img
							className="bg-dark rounded row ms-2"
							src={infoFilms.urlPhoto}
							alt="..."
							style={{
								minHeight: "200px"
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
							{infoFilms.description}
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
								·Escenas grabadas en esta película:{" "}
							</h2>
						</div>
					</div>
					<div className="my-card-content">
						<div className="row col-auto" style={{ margin: "10px", width: "15 rem", borderRadius: "50px" }}>
							{scenesByFilm.length > 0
								? scenesByFilm.map((item, index) => {
										return (
											<Movie
												id={item.id}
												place={item.place}
												country={item.country}
												urlPhoto={item.urlPhoto}
												key={item.id}
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
