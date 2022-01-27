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
	const [mywidth, setMywidth] = useState(0);

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
					.then(data => {
						setMarkerPositions(actions.getMarkerPositions(data));
						setMywidth(window.innerWidth);
					})
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

	window.onresize = () => setMywidth(window.innerWidth);

	return (
		<>
			<div className="container mt-3 p-3 mx-auto bg-dark text-light border-one rounded">
				{data.infoCountry ? (
					<div>
						<h2 className="color-one ms-4 ps-2 mt-2 title-one">{data.infoCountry.name}</h2>
						<div className="ms-lg-4 row">
							<img
								className="col-lg-4 col-sm-12 mt-3 me-lg-4"
								src={data.infoCountry.urlFlag}
								style={{ height: "18rem", objectFit: "cover" }}
							/>
							<div className="col-lg-6 col-sm-12 mt-3">
								<p className="text-light">{data.infoCountry.description}</p>
							</div>
						</div>
						{data.films.length > 0 ? (
							<div className="container-fluid mt-5">
								<h5 className="ms-4 title-one">Películas grabadas en este país:</h5>
								<div className="my-card-content">
									{data.films.map((item, index) => (
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
									))}
								</div>
							</div>
						) : null}
						{markerPositions.length > 0 ? (
							<>
								<h5 className="mt-5 mb-4 ms-5 title-one">
									Encuentra todos los sitios de rodaje en {data.infoCountry.name}:
								</h5>
								<div className="my-3 d-flex justify-content-center">
									<Map
										markers={markerPositions}
										zoom={5}
										width={Math.floor(mywidth * 0.58).toString()}
										height={Math.floor(mywidth * 0.3).toString()}
										center={markerPositions[0].position}
									/>
								</div>
							</>
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
