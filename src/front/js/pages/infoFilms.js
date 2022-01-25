import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";
import { Movie } from "../component/movie";
import Map from "../component/map.js";
import ModalMsg from "../component/modalmsg";

export const InfoFilms = () => {
	const { actions } = useContext(Context);

	// variable to show modal messages and function to close modal.
	const [onModal, setOnModal] = useState({ status: false, msg: "", fClose: null });
	const handleCloseModal = () => setOnModal({ status: false, msg: "", fClose: null });

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
						// order by place
						filteredData.sort((a, b) => (a.place > b.place ? 1 : b.place > a.place ? -1 : 0));
						setScenesByFilm(filteredData);
					})
					.catch(error => {
						setOnModal({
							status: true,
							msg: "Error cargando escenas del servidor: " + error,
							fClose: () => handleCloseModal(false)
						});
					});
				// load info of places for markerPositions of map.
				actions
					.getPlacesByFilm(params.theid)
					.then(res => res.json())
					.then(data => setMarkerPositions(actions.getMarkerPositions(data)))
					.catch(error => {
						setOnModal({
							status: true,
							msg: "Error cargando sitios de usuario del servidor: " + error,
							fClose: () => handleCloseModal(false)
						});
					});
			})
			.catch(error => {
				setOnModal({
					status: true,
					msg: "Error cargando película del servidor: " + error,
					fClose: () => handleCloseModal(false)
				});
			});
	}, []);

	return (
		<>
			<div
				className="container mt-3 mx-auto bg-dark p-3 card rounded"
				style={{ width: "75%", color: "white", borderColor: "#fa9f42" }}>
				{infoFilm ? (
					<div>
						<h2 className="title text" style={{ color: "#fa9f42", marginLeft: "30px" }}>
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
								<h5 style={{ paddingBottom: "10px", paddingTop: "40px", paddingLeft: "30px" }}>
									Sitios donde se ha grabado esta película:
								</h5>
								<div className="my-card-content">
									{scenesByFilm.map((item, index) => (
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
									))}
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
			{onModal.status ? <ModalMsg msg={onModal.msg} closeFunc={onModal.fClose} cancelFunc={null} /> : ""}
		</>
	);
};
