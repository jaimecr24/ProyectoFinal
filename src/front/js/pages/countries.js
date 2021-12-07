import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Countries = () => {
	const { store, actions } = useContext(Context);
	useEffect(() => {
		actions.fetchCountries();
	}, []);
	return (
		<div className="container-fluid content-row">
			<div className="title" style={{ textAlign: "center", paddingBottom: "20px" }}>
				<h1>Países</h1>
				<span>Descubre nuestro listado de países!</span>
			</div>
			<div className="cards-content">
				{store.countries
					? store.countries.map((item, index) => {
							return (
								<div
									className="row col-auto"
									style={{ margin: "10px", width: "15 rem", borderRadius: "50px" }}
									key={index}>
									<div className="card bg-dark">
										<img src={item.urlFlag} className="characters card-img-top mx-auto" alt="..." />
										<div className="card-body">
											<h5
												className="card-title text-warning"
												style={{ textAlign: "center", paddingBottom: "40px" }}>
												{item.name}
											</h5>
											<a className="btn btn-primary float-start">
												<span className="text-warning ">
													{" "}
													<Link
														to="/infocountries"
														onClick={() => localStorage.setItem("id", item.id)}>
														<span className="btn btn-outline-primary">Aprender más</span>
													</Link>
												</span>
											</a>
											<button className="btn btn-outline-warning float-end">
												<i className="fas fa-heart" />
											</button>
										</div>
									</div>
								</div>
							);
					  })
					: "Cargando"}
			</div>
		</div>
	);
};
