import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Scene } from "../component/scene.js";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Map from "../component/map.js";
import Comments from "../component/Comments.js";
import ModalMsg from "../component/modalmsg";

export const SinglePlace = () => {
	const { actions, store } = useContext(Context);
	const params = useParams();

	// variable to show modal messages and function to close modal.
	const [onModal, setOnModal] = useState({ status: false, msg: "", fClose: null });
	const handleCloseModal = () => setOnModal({ status: false, msg: "", fClose: null });

	const [data, setData] = useState({
		place: null,
		scenes: [],
		markerPositions: [],
		liked: false //Used for show the symbol heart as liked or not liked.
	});

	useEffect(() => {
		// Get data of a single place
		actions
			.getSinglePlace(params.theid)
			.then(res => res.json())
			.then(myplace => {
				// Get data of scenes
				actions
					.getScenesByPlace(params.theid)
					.then(res => res.json())
					.then(myscenes =>
						// Now we set all data in variable of state.
						setData({
							place: myplace,
							scenes: myscenes,
							markerPositions: actions.getSingleMarkerPosition(myplace),
							liked: store.activeUser.id ? store.activeUser.listFav.includes(myplace.id) : false
						})
					)
					.catch(error => {
						setOnModal({
							status: true,
							msg: "Error cargando escenas del servidor: " + error,
							fClose: () => handleCloseModal(false)
						});
					});
			})
			.catch(error => {
				setOnModal({
					status: true,
					msg: "Error cargando datos del sitio desde el servidor: " + error,
					fClose: () => handleCloseModal(false)
				});
			});
	}, []);

	const handleLike = () => {
		let prevCount = data.place.countLikes;
		let sum = 0;
		if (data.liked) {
			actions.delFavPlace(data.place.id);
			sum = -1;
		} else {
			actions.addFavPlace(data.place.id);
			sum = +1;
		}
		setData({
			...data,
			liked: !data.liked,
			place: { ...data.place, countLikes: prevCount + sum }
		});
	};

	return (
		<>
			<div
				className="container mt-3 mx-auto bg-dark p-3 card rounded"
				style={{ width: "75%", color: "white", borderColor: "#fa9f42" }}>
				{data.place ? (
					<div>
						<h2 className="text" style={{ color: "#fa9f42", marginLeft: "30px" }}>
							{data.place.name}
						</h2>
						<div className="row mx-3 px-3">
							<div className="row col-5 me-5">
								<img
									className="rounded row"
									src={data.place.urlPhoto}
									alt="..."
									style={{ minHeight: "200px", objectFit: "cover", paddingTop: "10px" }}
								/>
								<div className="text-white mt-1">
									{store.activeUser.id ? (
										<span className="btn btn-outline-danger me-2" onClick={handleLike}>
											{data.liked ? (
												<i className="fas fa-heart" />
											) : (
												<i className="far fa-heart" />
											)}
										</span>
									) : (
										""
									)}
									<span>Likes: {data.place.countLikes}</span>
								</div>
							</div>
							<div className="col-6">
								<Link to={"/infocountries/" + data.place.idCountry} style={{ textDecoration: "none" }}>
									<p className="text" style={{ color: "#fa9f42" }}>
										{data.place.countryName}
									</p>
								</Link>
								<p className="text-white">{data.place.description}</p>
							</div>
						</div>
						<div className="row mt-5 mx-3 px-3" style={{ paddingTop: "10px" }}>
							<h5>¿Dónde encontrar {data.place.name}?</h5>

							<div className="row">
								<div className="d-flex justify-content-center" style={{ paddingTop: "10px" }}>
									{data.markerPositions.length > 0 ? (
										<Map
											markers={data.markerPositions}
											zoom={10}
											width="800"
											height="350"
											center={data.markerPositions[0].position}
										/>
									) : (
										""
									)}
								</div>
							</div>
						</div>
						{data.scenes.length > 0 ? (
							<div className="row mt-5 px-5">
								<h5 style={{ paddingBottom: "10px" }}>Escenas rodadas en {data.place.name}:</h5>
								{data.scenes.map(value => (
									<Scene
										id={value.idFilm}
										description={value.description}
										title={value.title}
										urlPhoto={value.urlPhoto}
										key={value.idFilm}
										spoiler={value.spoiler}
									/>
								))}
							</div>
						) : (
							""
						)}
						{store.activeUser.id ? <Comments idPlace={parseInt(params.theid)} /> : ""}
					</div>
				) : (
					""
				)}
			</div>
			{onModal.status ? <ModalMsg msg={onModal.msg} closeFunc={onModal.fClose} cancelFunc={null} /> : ""}
		</>
	);
};
