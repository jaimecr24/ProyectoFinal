import React, { useEffect } from "react";
import { useContext } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";
import { Movie } from "../component/movie";

export const InfoFilms = () => {
	const { store, actions } = useContext(Context);
	const params = useParams();
	useEffect(() => {
		actions.getInfoFilms(params.theid);
	}, []);

	return (
		<div>
			{store.infoFilms ? (
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
						{store.infoFilms.name}
					</h2>
					<div className="my-img col-md-6" style={{ justifyContent: "center" }}>
						<img
							className="bg-dark rounded row ms-2"
							src={store.infoFilms.urlPhoto}
							alt="..."
							style={{
								minHeight: "200px"
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
							{store.infoFilms.description}
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
								·Escenas grabadas en esta película:{" "}
							</h2>
						</div>
					</div>
					<div className="my-card-content">
						<div className="row col-auto" style={{ margin: "10px", width: "15 rem", borderRadius: "50px" }}>
							{store.scenesByFilm
								? store.scenesByFilm.map((item, index) => {
										return (
											<Movie
												id={item.id}
												place={item.place}
												country={item.country}
												urlPhoto={item.urlPhoto}
												key={item.id}
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
