import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { FilmCountry } from "../component/filmCountry";

export const InfoCountries = () => {
	const params = useParams();
	const { actions } = useContext(Context);

	const [data, setData] = useState({ infoCountry: null, films: [] });

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
					.then(myfilms => setData({ infoCountry: mycountry, films: myfilms }))
					.catch(error => alert("Error loading films from backend: " + error));
			})
			.catch(error => alert("Error loading country from backend: " + error));
	}, []);

	return (
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
					) : (
						""
					)}
				</div>
			) : (
				""
			)}
		</div>
	);
};
