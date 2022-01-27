import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import ModalMsg from "../component/modalmsg";

export const Films = () => {
	const { actions } = useContext(Context);

	// variable to show modal messages and function to close modal.
	const [onModal, setOnModal] = useState({ status: false, msg: "", fClose: null });
	const handleCloseModal = () => setOnModal({ status: false, msg: "", fClose: null });

	const [data, setData] = useState([]);
	useEffect(() => {
		actions
			.fetchFilms()
			.then(resp => resp.json())
			.then(films => {
				// order films by name
				films.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
				setData(films);
			})
			.catch(error => {
				setOnModal({
					status: true,
					msg: "Error cargando películas del servidor: " + error,
					fClose: () => handleCloseModal(false)
				});
			});
	}, []);
	return (
		<div className="container-fluid title-one text-center mb-4">
			<h1 className="color-one">Películas</h1>
			<h5 className="text-light">Descubre nuestro listado de peliculas!</h5>
			<div className="my-card-content">
				{data.map((item, index) => (
					<div
						className="infocards row col-auto"
						style={{ margin: "10px", width: "15 rem", borderRadius: "50px" }}
						key={index}>
						<div className="design-card bg-dark">
							<img
								src={item.urlPhoto}
								className="characters card-img-top mx-auto"
								alt="..."
								style={{ objectFit: "cover", width: "100%" }}
							/>
							<div className="card-body">
								<h5
									className="card-title card-title-text"
									style={{
										textAlign: "center",
										paddingBottom: "40px",
										color: "#fa9f42"
									}}>
									{item.name}
								</h5>

								<Link to={"/infofilms/" + item.id}>
									<button type="button" className="btn-link">
										Aprender más
									</button>
								</Link>
							</div>
						</div>
					</div>
				))}
			</div>
			{onModal.status ? <ModalMsg msg={onModal.msg} closeFunc={onModal.fClose} cancelFunc={null} /> : ""}
		</div>
	);
};
