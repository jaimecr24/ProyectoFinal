import React, { useEffect } from "react";
import { useContext } from "react";
import { Context } from "../store/appContext";

export const SinglePlace = () => {
	const { store, actions } = useContext(Context);
	useEffect(() => {
		actions.getSinglePlace(localStorage.getItem("id"));
	}, []);

	return (
		<div className="container mt-3 mx-auto bg-white p-3 card rounded" style={{ width: "75%" }}>
			{store.singlePlace ? (
				<div>
					<h2 className="text-success">{store.singlePlace.name}</h2>
					<div className="row mx-3 px-3">
						<div className="row col-5 me-5">
							<img
								className="bg-dark rounded row ms-2"
								src="..."
								alt="..."
								style={{ minHeight: "200px" }}
							/>

							<div className="text-dark mt-1">
								<button className="border rounded me-1">
									<i className="fas fa-film" />
								</button>
								<span>
									<i className="fas fa-heart text-danger" /> {store.singlePlace.countLikes}
								</span>
							</div>
						</div>
						<div className="col-6">
							<p className="text-danger">{store.singlePlace.idCountry}</p>
							<p className="text-dark">{store.singlePlace.description}</p>
						</div>
					</div>
					<div className="row mt-5 mx-3 px-3">
						<h5>¿Dónde encontrar {store.singlePlace.name}?</h5>

						<iframe
							className="col-5 me-5"
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26432.43434605815!2d-118.34398771265504!3d34.09374955803937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bf07045279bf%3A0xf67a9a6797bdfae4!2sHollywood%2C%20Los%20%C3%81ngeles%2C%20California%2C%20EE.%20UU.!5e0!3m2!1ses!2ses!4v1638286747086!5m2!1ses!2ses"
							style={{ height: "350px" }}
						/>
						<div className="col-6">
							<p className="text-dark">Dirección:</p>
							<p className="text-dark">Coordenadas:</p>
						</div>
					</div>
					<div className="row mt-5 px-5">
						<h5>Series y películas rodadas en {store.singlePlace.name}:</h5>
						<div className="card p-3 mx-5 rounded  mb-5 w-100 mx-auto">
							<div className="row">
								<div className="col-4">
									<h5 className="card-title text-success">Película</h5>
									<img
										className="card-img-top bg-dark row m-3"
										src="..."
										alt="..."
										style={{ height: "200px" }}
									/>
								</div>
								<div className="card-body col-6 ms-5">
									<div style={{ fontSize: "10px" }}>
										<div className="text-dark">Descripción de la escena</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
};
