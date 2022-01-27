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
	const [mywidth, setMywidth] = useState(0);
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
					.then(data => {
						setMarkerPositions(actions.getMarkerPositions(data));
						setMywidth(window.innerWidth);
					})
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

	// Set the atribute mywidth, to adjust size of map.
	window.onresize = () => setMywidth(window.innerWidth);

	return (
		<>
			<div className="container mt-3 p-3 mx-auto bg-dark text-light border-one rounded">
				{infoFilm ? (
					<div>
						<h2 className="color-one ms-4 ps-2 mt-2 title-one">{infoFilm.name}</h2>
						<div className="ms-lg-4 row">
							<img
								className="col-lg-5 col-sm-12 mt-3 me-lg-4"
								src={infoFilm.urlPhoto}
								style={{ height: "20rem", objectFit: "cover" }}
							/>
							<div className="col-lg-6 col-sm-12 mt-3">
								<p className="color-one">
									{infoFilm.director}, {infoFilm.year}
								</p>
								<p className="text-light">{infoFilm.description}</p>
							</div>
						</div>
						{scenesByFilm.length > 0 ? (
							<div className="container-fluid mt-5">
								<h5 className="ms-4 title-one">Sitios donde se ha grabado esta película:</h5>
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
							<>
								<h5 className="mt-5 mb-4 ms-5 title-one">
									Encuentra todos los sitios en los que se ha rodado {infoFilm.name}:
								</h5>
								<div className="my-3 d-flex justify-content-center">
									<Map
										markers={markerPositions}
										zoom={2}
										width={Math.floor(mywidth * 0.58).toString()}
										height={Math.floor(mywidth * 0.3).toString()}
										center={{ lat: 40.416775, lng: 3.70379 }}
									/>
								</div>
							</>
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
