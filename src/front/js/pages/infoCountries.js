import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { FilmCountry } from "../component/filmCountry";

export const InfoCountries = () => {
	const [infoCountries, setInfoCountries] = useState({});
	const [filmsByCountry, setFilmsByCountry] = useState({});
	const params = useParams();
	const getInfoCountries = id => {
		fetch(process.env.BACKEND_URL + "/api/countries/" + id)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				setInfoCountries(data);
			})
			.then(() => getActions().getFilmsByFilm(id))
			.catch(error => console.log("Error loading place from backend", error));
	};
	const getFilmsByCountry = id => {
		fetch(process.env.BACKEND_URL + "/api/films/country/" + id)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				setFilmsByCountry(data);
			})
			.catch(error => console.log("Error loading place from backend", error));
	};
	useEffect(() => {
		getInfoCountries(params.theid);
		getFilmsByCountry(params.theid);
	}, []);

	return (
		<div
			className="container mt-3 mx-auto bg-dark p-3 card rounded"
			style={{ width: "75%", color: "white", borderColor: "#fa9f42" }}>
			{infoCountries ? (
				<div>
					<h2 className="text" style={{ color: "#fa9f42", marginLeft: "30px" }}>
						{infoCountries.name}
					</h2>
					<div className="row mx-3 px-3">
						<div className="row col-5 me-5">
							<img
								className="rounded row"
								src={infoCountries.urlFlag}
								alt="..."
								style={{ minHeight: "200px", objectFit: "cover", paddingTop: "10px" }}
							/>
						</div>
						<div className="col-6">
							<p className="text-white">{infoCountries.description}</p>
						</div>
					</div>
					{filmsByCountry.length > 0 ? (
						<div className="container-fluid content-row">
							<h5 style={{ paddingBottom: "10px", paddingTop: "30px" }}>
								·Películas que fueron grabadas en este país:
							</h5>
							<div className="my-card-content">
								{filmsByCountry.map((item, index) => {
									return (
										<div
											className="infocards row col-auto"
											key={index}
											style={{ margin: "10px", width: "15 rem", borderRadius: "50px" }}>
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
				</div>
			) : null}
		</div>
	);
};
