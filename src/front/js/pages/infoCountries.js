import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { FilmCountry } from "../component/filmCountry";
import Map from "../component/map.js";
import ModalMsg from "../component/modalmsg";

export const InfoCountries = () => {
	const params = useParams();
	const { actions } = useContext(Context);

	// variable to show modal messages and function to close modal.
	const [onModal, setOnModal] = useState({ status: false, msg: "", fClose: null });
	const handleCloseModal = () => setOnModal({ status: false, msg: "", fClose: null });

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
					.then(myfilms => {
						// order films by name
						myfilms.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
						setData({ infoCountry: mycountry, films: myfilms });
					})
					.catch(error => {
						setOnModal({
							status: true,
							msg: "Error cargando películas del servidor: " + error,
							fClose: () => handleCloseModal(false)
						});
					});
				// Get info of places of country where a film is filmmed.
				actions
					.getPlacesByCountry(params.theid)
					.then(res => res.json())
					.then(data => setMarkerPositions(actions.getMarkerPositions(data)))
					.catch(error => {
						setOnModal({
							status: true,
							msg: "Error cargando sitios del servidor: " + error,
							fClose: () => handleCloseModal(false)
						});
					});
			})
			.catch(error => {
				setOnModal({
					status: true,
					msg: "Error país del servidor: " + error,
					fClose: () => handleCloseModal(false)
				});
			});
	}, []);

	return (
		<>
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
												style={{
													margin: "10px",
													width: "15 rem",
													borderRadius: "50px",
													paddingRight: "10px"
												}}>
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
										<Map
											markers={markerPositions}
											zoom={5}
											width="800"
											height="500"
											center={markerPositions[0].position}
										/>
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
			{onModal.status ? <ModalMsg msg={onModal.msg} closeFunc={onModal.fClose} cancelFunc={null} /> : ""}
		</>
	);
};
