import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Scene } from "../component/scene.js";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Map from "../component/map.js";
import Comments from "../component/Comments.js";

export const SinglePlace = () => {
	const { actions, store } = useContext(Context);
	const [singlePlace, setSinglePlace] = useState({});
	const [scenesByPlace, setScenesByPlace] = useState({});
	const [likes, setLikes] = useState(0);
	const [country, setCountry] = useState("");
	const [markerPositions, setMarkerPositions] = useState([]);
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

	const countLikesPlace = id => {
		fetch(process.env.BACKEND_URL + "/api/favplace/" + id)
			.then(resp => resp.json())
			.then(data => setLikes(data.length))
			.catch(error => console.log("Error loading places from backend", error));
	};

	useEffect(() => {
		getSinglePlace(params.theid);
		getScenesByPlace(params.theid);
		countLikesPlace(params.theid);
		singlePlace ? setMarkerPositions(actions.getSingleMarkerPosition(singlePlace)) : null;
	}, []);

	useEffect(
		() => {
			singlePlace ? setMarkerPositions(actions.getSingleMarkerPosition(singlePlace)) : null;
			singlePlace ? getCountryName(singlePlace.idCountry) : null;
		},
		[singlePlace]
	);

	likes ? console.log(likes) : null;

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

							<div className="text-white mt-1">
								{store.activeUser.id ? (
									<span
										className="btn btn-outline-danger me-2"
										onClick={() => actions.addFavPlace(singlePlace.id)}>
										<i className="fas fa-heart" />
									</span>
								) : null}

								<span>Likes: {likes ? likes : 0}</span>
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

					{store.activeUser.id ? (
						<div>
							<Comments
								commentsUrl="http://localhost:3000/comments"
								currentUserId={store.activeUser.id}
								place={params.theid}
							/>
						</div>
					) : null}
				</div>
			) : null}
		</div>
	);
};
