import React, { useContext, useState, useEffect } from "react";

import { useHistory } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link } from "react-router-dom";
import Map from "../component/map.js";
import cameraImgUrl from "../../img/camera.png";

export const Home = () => {
	const { actions } = useContext(Context);

	const random = Math.floor(Math.random() * 3 + 1);

	const [singlePlace, setSinglePlace] = useState({});

	const getSinglePlace = id => {
		fetch(process.env.BACKEND_URL + "/api/places/" + id)
			.then(res => res.json())
			.then(data => {
				setSinglePlace(data);
			})
			.catch(error => console.log("Error loading place from backend", error));
	};
	useEffect(() => {
		getSinglePlace(random);
	}, []);

	let history = useHistory();

	const style = {
		width: "200px"
	};
	const cardStyle = {
		width: "15rem"
	};

	let [sug, setSug] = useState([]);

	const handleChange = e => {
		let key = e.target.value;
		if (key.length == 1) {
			actions
				.getBrowsePlace(key)
				.then(res => res.json())
				.then(data => setSug(data.map(e => e["name"])))
				.catch(error => console.log("Error in getBrowsePlace", error));
		}
	};

	const handleSearch = e => {
		e.preventDefault();
		let key = document.getElementById("mySearch").value;
		if (key.length > 0) {
			actions
				.getBrowsePlace(key)
				.then(res => res.json())
				.then(data => {
					if (data.length > 0) {
						let path = "/place/" + data[0]["id"]; // Go to the first place. To do: present a list of results to user.
						history.push({ pathname: path }); // Equivalent in js to <Link ... >
					} else console.log("data is []");
				})
				.catch(error => console.log("Error in getBrowsePlace", error));
		}
	};

	return (
		<div className="text-center mt-4">
			<h1 className="" style={{ fontFamily: "IM Fell Great Primer SC", fontSize: "55px", color: "#fa9f42" }}>
				MovTour
			</h1>
			<h4 className="text-white" style={{ fontFamily: "IM Fell Great Primer SC" }}>
				“The world isnt in your books and maps, it is out there.” ― The Hobbit, J.R.R. Tolkien
			</h4>
			<form className="d-flex justify-content-center my-5" onSubmit={handleSearch}>
				<input
					id="mySearch"
					type="search"
					list="suggestions"
					className="form-control rounded fs-4"
					placeholder="Buscar un lugar"
					onChange={handleChange}
					style={{ width: "40rem" }}
				/>
				<button type="submit" className="btn btn-dark" onSubmit={handleSearch} style={{ width: "10rem" }}>
					Buscar
				</button>
				<datalist id="suggestions">
					{sug ? sug.map((e, i) => <option key={i} data-value={i} value={e} />) : ""}
				</datalist>
			</form>
			{singlePlace ? (
				<div className="row">
					<div className="card px-0 rounded offset-2 col-3 py-0" style={{ minWidth: "350px" }}>
						<img
							className="card-img-top mt-0"
							src={singlePlace.urlPhoto}
							alt="..."
							style={{ height: "200px" }}
						/>
						<div className="card-body">
							<div>
								<h5 className="card-title text-success text-center">{singlePlace.name}</h5>
								<div style={{ fontSize: "10px" }}>
									<div className="text-dark">{singlePlace.description}</div>
								</div>

								<div>
									<Link to={"/place/" + singlePlace.id}>
										<span className="btn btn-outline-success">Ver</span>
									</Link>

									<span className="btn border rounded ms-1">
										<i className="fas fa-film" />
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className="col-6">
						<Map
							lat={singlePlace.latitude}
							lng={singlePlace.longitude}
							width="600"
							height="350"
							name={singlePlace.name}
							direction={singlePlace.address}
						/>
					</div>
				</div>
			) : null}
		</div>
	);
};
