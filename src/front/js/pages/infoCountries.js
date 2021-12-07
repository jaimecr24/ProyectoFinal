import React, { useEffect } from "react";
import { useContext } from "react";
import { Context } from "../store/appContext";

export const InfoCountries = () => {
	const { store, actions } = useContext(Context);
	useEffect(() => {
		actions.getInfoCountries(localStorage.getItem("id"));
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
					<div className="col-md-6">
						<img
							className="bg-dark rounded row ms-2"
							src={store.infoCountries.urlFlag}
							alt="..."
							style={{
								height: "300px"
							}}
						/>

						<div
							style={{
								paddingTop: "20px",
								textAlign: "center",
								paddingBottom: "20px"
							}}>
							<button className="btn btn-outline-warning">
								<i className="fas fa-heart" />
							</button>
						</div>
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
					<div className="cards-content">
						<div className="row col-auto" style={{ margin: "10px", width: "15 rem", borderRadius: "50px" }}>
							<div className="card bg-dark">
								<img
									src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/1200px-Flag_of_the_United_Kingdom_%283-5%29.svg.png"
									className="characters card-img-top mx-auto"
									alt="..."
								/>
								<div className="card-body">
									<h5
										className="card-title text-warning"
										style={{ textAlign: "center", paddingBottom: "40px" }}>
										Titulo
									</h5>
									<a className="btn btn-primary float-start">
										<span className="text-warning ">
											{" "}
											<span className="btn btn-outline-primary">Aprender más</span>
										</span>
									</a>
									<button className="btn btn-outline-warning float-end">
										<i className="fas fa-heart" />
									</button>
								</div>
							</div>
						</div>
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
								·Sitios de rodaje en este país:{" "}
							</h2>
						</div>
					</div>
					<div className="cards-content">
						<div className="row col-auto" style={{ margin: "10px", width: "15 rem", borderRadius: "50px" }}>
							<div className="card bg-dark">
								<img
									src="https://www.civitatis.com/blog/wp-content/uploads/2021/01/escenarios-rodaje-harry-potter.jpg"
									className="characters card-img-top mx-auto"
									alt="..."
								/>
								<div className="card-body">
									<h5
										className="card-title text-warning"
										style={{ textAlign: "center", paddingBottom: "40px" }}>
										Titulo
									</h5>
									<a className="btn btn-primary float-start">
										<span className="text-warning ">
											{" "}
											<span className="btn btn-outline-primary">Aprender más</span>
										</span>
									</a>
									<button className="btn btn-outline-warning float-end">
										<i className="fas fa-heart" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
};
