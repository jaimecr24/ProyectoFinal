import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/home.css";
import Map from "../component/map.js";
//import ModalMsg from "../component/modalmsg";

export const Home = () => {
	let history = useHistory();
	const { actions, store } = useContext(Context);

	//const [onModal, setOnModal] = useState(false);
	const [data, setData] = useState({ film: null, place: null, markerPositions: [] });
	const isLiked = idPlace => store.activeUser.listFav.includes(idPlace);
	const handleLike = idPlace => {
		isLiked(idPlace) ? actions.delFavPlace(idPlace) : actions.addFavPlace(idPlace);
	};

	useEffect(() => {
		// Load all places to mark locations in map
		actions
			.getPlaces()
			.then(res => res.json())
			.then(places => {
				// Load data of a single film (random)
				actions
					.getRandomFilm()
					.then(res => res.json())
					.then(myfilm => {
						let rnd = Math.floor(Math.random() * places.length);
						setData({
							film: myfilm,
							place: places[rnd],
							markerPositions: actions.getMarkerPositions(places)
						});
					})
					.catch(error => alert("Error loading film from backend: " + error));
			})
			.catch(error => alert("Error loading places from backend: " + error));
	}, []);

	let [sug, setSug] = useState([]);

	const handleChange = e => {
		let key = e.target.value;
		if (key.length == 1) {
			actions
				.getBrowsePlace(key)
				.then(res => res.json())
				.then(data => setSug(data.map(e => e["name"])))
				.catch(error => alert("Error in getBrowsePlace: " + error));
		}
	};

	const handleSearch = e => {
		e.preventDefault();
		setOnModal(true);
		let key = document.getElementById("mySearch").value;
		if (key.length > 0) {
			actions
				.getBrowsePlace(key)
				.then(res => res.json())
				.then(data => {
					if (data.length > 0) {
						let path = "/place/" + data[0]["id"]; // Go to the first place. To do: present a list of results to user.
						history.push({ pathname: path }); // Equivalent in js to <Link ... >
					} else alert("data is []");
				})
				.catch(error => alert("Error in getBrowsePlace: " + error));
		}
	};

	// const handleCloseModal = e => setOnModal(false);

	return (
		<div className="text-center mt-4">
			<h1 className="" style={{ fontFamily: "IM Fell Great Primer SC", fontSize: "55px", color: "#fa9f42" }}>
				MovTour
			</h1>
			<h4 className="text-white" style={{ fontFamily: "IM Fell Great Primer SC" }}>
				“The world isnt in your books and maps, it is out there.” ― The Hobbit, J.R.R. Tolkien
			</h4>
			<form className="d-flex justify-content-center my-4" onSubmit={handleSearch}>
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

			{data.place ? (
				<div className="row mt-0">
					<div
						className="card design-card bg-dark w-75 mx-auto d-flex flex-row mt-0"
						style={{ borderColor: "#fa9f42" }}>
						<div className="card border-0 col-6 bg-dark">
							<div>
								<h3 className="text-light">Sitio de rodaje recomendado:</h3>
							</div>
							<img
								src={data.place.urlPhoto}
								className="characters card-img-top mx-auto"
								alt={data.place.name}
								style={{ objectFit: "cover" }}
							/>
							<div className="card-body bg-dark">
								<h5
									className="card-title"
									style={{
										textAlign: "center",
										paddingBottom: "25px",
										color: "#fa9f42"
									}}>
									{data.place.name}
								</h5>

								<Link to={"/place/" + data.place.id}>
									<span className="btn btn-outline">Aprender más</span>
								</Link>
								{store.activeUser.id ? (
									<span
										className="btn btn-outline-danger ms-1"
										onClick={() => handleLike(data.place.id)}>
										{isLiked(data.place.id) ? (
											<i className="fas fa-heart" />
										) : (
											<i className="far fa-heart" />
										)}
									</span>
								) : (
									""
								)}
							</div>
						</div>

						<div className="card border-0 col-6 bg-dark">
							<div>
								<h3 className="text-light">Película recomendada:</h3>
							</div>
							<img
								src={data.film.urlPhoto}
								className="characters card-img-top mx-auto"
								alt={data.film.name}
								style={{ objectFit: "cover" }}
							/>
							<div className="card-body bg-dark">
								<h5
									className="card-title"
									style={{
										textAlign: "center",
										paddingBottom: "25px",
										color: "#fa9f42"
									}}>
									{data.film.name}
								</h5>

								<Link to={"/infofilms/" + data.film.id}>
									<span className="btn btn-outline">Aprender más</span>
								</Link>
							</div>
						</div>
					</div>
				</div>
			) : (
				""
			)}
			<br />
			{data.markerPositions.length > 0 ? (
				<div className="row mt-0">
					<div>
						<div className="card design-card bg-dark w-75 mx-auto mt-0" style={{ borderColor: "#fa9f42" }}>
							<div>
								<h3 className="text-light bg-dark">Explora todos nuestros sitios de rodaje:</h3>
							</div>

							<div className="card mx-auto">
								<Map
									markers={data.markerPositions}
									zoom={2}
									width="900"
									height="600"
									center={{ lat: 40.416775, lng: 3.70379 }}
								/>
							</div>
						</div>
					</div>
				</div>
			) : (
				""
			)}
			{
				//onModal ? <ModalMsg msg="Mensaje de prueba" closeFunc={handleCloseModal} /> : ""
			}
		</div>
	);
};
