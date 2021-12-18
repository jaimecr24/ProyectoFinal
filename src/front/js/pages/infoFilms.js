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
								<div className="infocards row col-auto">
									{scenesByFilm.map((item, index) => {
										return (
											<Movie
												id={item.idPlace}
												place={item.place}
												country={item.country}
												urlPhoto={item.urlPhoto}
												picture={item.picture}
												key={item.idPlace}
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
