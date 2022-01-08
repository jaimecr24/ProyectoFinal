import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Countries = () => {
	const { store, actions } = useContext(Context);
	const [data, setData] = useState([]);
	useEffect(() => {
		actions
			.fetchCountries()
			.then(resp => resp.json())
			.then(countries => setData(countries))
			.catch(error => alert("Error loading message from backend: " + error));
	}, []);
	return (
		<div className="container-fluid content-row">
			<div className="title" style={{ textAlign: "center", paddingBottom: "20px" }}>
				<h1 style={{ color: "#fa9f42" }}>Países</h1>
				<span style={{ color: "white" }}>Descubre nuestro listado de países!</span>
			</div>
			<div className="my-card-content">
				{data.map((item, index) => (
					<div
						className="infocards row col-auto"
						style={{ margin: "10px", width: "15 rem", borderRadius: "50px" }}
						key={index}>
						<div className="design-card bg-dark">
							<img
								src={item.urlFlag}
								className="characters card-img-top mx-auto"
								alt="..."
								style={{ objectFit: "cover" }}
							/>
							<div className="card-body">
								<h5
									className="card-title"
									style={{
										textAlign: "center",
										paddingBottom: "40px",
										color: "#fa9f42"
									}}>
									{item.name}
								</h5>

								<Link to={"/infocountries/" + item.id}>
									<span className="btn btn-outline">Aprender más</span>
								</Link>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
