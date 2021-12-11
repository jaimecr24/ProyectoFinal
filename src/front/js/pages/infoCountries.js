import React, { useEffect } from "react";
import { useContext } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Country } from "../component/country";

export const InfoCountries = () => {
	const { store, actions } = useContext(Context);
	const params = useParams();
	useEffect(() => {
		actions.getInfoCountries(params.theid);
	}, []);

	return (
		<div>
			{store.infoCountries ? (
				<div>
					<h2
						style={{
							color: "white",
							fontFamily: "Permanent Marker",
							fontStyle: "cursive",
							paddingBottom: "20px",
							textAlign: "center",
							paddingBottom: "20px"
						}}>
						{store.infoCountries.name}
					</h2>
					<div className="my-img col-md-6">
						<img
							className="bg-dark rounded row ms-2"
							src={store.infoCountries.urlFlag}
							alt="..."
							style={{
								height: "300px"
							}}
						/>
					</div>
					<div>
						<p
							style={{
								color: "white",
								paddingBottom: "20px",
								paddingTop: "20px",
								textAlign: "center"
							}}>
							{store.infoCountries.description}
						</p>
					</div>
					<div>
						<div>
							<h2
								style={{
									color: "white",
									paddingBottom: "20px",
									paddingTop: "20px"
								}}>
								{" "}
								·Películas que fueron grabadas en este país:{" "}
							</h2>
						</div>
					</div>
					<div className="my-card-content">
						<div className="row col-auto" style={{ margin: "10px", width: "15 rem", borderRadius: "50px" }}>
							{store.scenesByFilm
								? store.scenesByFilm.map((item, index) => {
										return (
											<Country
												id={item.idFilm}
												description={item.description}
												movie={item.movie}
												picture={item.picture}
												key={item.idFilm}
											/>
										);
								  })
								: null}
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
};
