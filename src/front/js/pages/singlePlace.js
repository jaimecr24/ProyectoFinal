import React, { useEffect, useState } from "react";
import { Scene } from "../component/scene.js";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Map from "../component/map.js";

export const SinglePlace = () => {
	const [singlePlace, setSinglePlace] = useState({});
	const [scenesByPlace, setScenesByPlace] = useState({});
	const [country, setCountry] = useState("");
	const params = useParams();
	const getSinglePlace = id => {
		fetch(process.env.BACKEND_URL + "/api/places/" + id)
			.then(res => res.json())
			.then(data => {
				setSinglePlace(data);
			})
			.catch(error => console.log("Error loading place from backend", error));
	};
	const getScenesByPlace = id => {
		fetch(process.env.BACKEND_URL + "/api/scenes/place/" + id)
			.then(res => res.json())
			.then(data => {
				setScenesByPlace(data);
			})
			.catch(error => console.log("Error loading scenes from backend", error));
	};
	const getCountryName = id => {
		fetch(process.env.BACKEND_URL + "/api/countries/" + id)
			.then(res => res.json())
			.then(data => {
				setCountry(data.name);
			})
			.catch(error => console.log("Error loading country from backend", error));
	};

	useEffect(() => {
		getSinglePlace(params.theid);
		getScenesByPlace(params.theid);
	}, []);
	useEffect(() => {
		singlePlace ? getCountryName(singlePlace.idCountry) : null;
	});

	return (
		<div
			className="container mt-3 mx-auto bg-dark p-3 card rounded"
			style={{ width: "75%", color: "white", borderColor: "#fa9f42" }}>
			{singlePlace && country ? (
				<div>
					<h2 className="text" style={{ color: "#fa9f42", marginLeft: "30px" }}>
						{singlePlace.name}
					</h2>
					<div className="row mx-3 px-3">
						<div className="row col-5 me-5">
							<img
								className="rounded row"
								src={singlePlace.urlPhoto}
								alt="..."
								style={{ minHeight: "200px", objectFit: "cover", paddingTop: "10px" }}
							/>

							<div className="text-dark mt-1">
								<button className="border rounded me-1">
									<i className="fas fa-film" />
								</button>
								<span>
									<i className="fas fa-heart text-danger" /> {singlePlace.countLikes}
								</span>
							</div>
						</div>
						<div className="col-6">
							<Link to={"/infocountries/" + singlePlace.idCountry} style={{ textDecoration: "none" }}>
								<p className="text" style={{ color: "#fa9f42" }}>
									{country}
								</p>
							</Link>

							<p className="text-white">{singlePlace.description}</p>
						</div>
					</div>
					<div className="row mt-5 mx-3 px-3" style={{ paddingTop: "10px" }}>
						<h5>¿Dónde encontrar {singlePlace.name}?</h5>

						<div className="row">
							<div className="d-flex justify-content-center" style={{ paddingTop: "10px" }}>
								{singlePlace ? (
									<Map
										lat={singlePlace.latitude}
										lng={singlePlace.longitude}
										width="800"
										height="350"
										name={singlePlace.name}
										direction={singlePlace.address}
									/>
								) : null}
							</div>
						</div>
					</div>
					{scenesByPlace.length > 0 ? (
						<div className="row mt-5 px-5">
							<h5 style={{ paddingBottom: "10px" }}>Series y películas rodadas en {singlePlace.name}:</h5>

							{scenesByPlace.map((value, index) => {
								return (
									<Scene
										id={value.idFilm}
										description={value.description}
										title={value.title}
										urlPhoto={value.urlPhoto}
										key={value.idFilm}
									/>
								);
							})}
						</div>
					) : null}
				</div>
			) : null}
		</div>
	);
};
