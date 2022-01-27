import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/home.css";
import Map from "../component/map.js";
import ModalMsg from "../component/modalmsg";

export const Home = () => {
	let history = useHistory();
	const { actions, store } = useContext(Context);

	// variable to show modal messages and function to close modal.
	const [onModal, setOnModal] = useState({ status: false, msg: "", fClose: null });
	const handleCloseModal = bLogout => {
		setOnModal({ status: false, msg: "", fClose: null });
		if (bLogout) actions.logout();
	};

	// General data of component
	const [data, setData] = useState({ mywidth: 0, film: null, place: null, markerPositions: [] });
	const isLiked = idPlace => store.activeUser.listFav.includes(idPlace);

	// Set/unset like
	const handleLike = idPlace => {
		isLiked(idPlace) ? actions.delFavPlace(idPlace) : actions.addFavPlace(idPlace);
	};

	useEffect(() => {
		if (store.activeUser.id) testToken();
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
							mywidth: window.innerWidth,
							film: myfilm,
							place: places[rnd],
							markerPositions: actions.getMarkerPositions(places)
						});
					})
					.catch(error => {
						setOnModal({
							status: true,
							msg: "Error cargando película del servidor: " + error,
							fClose: () => handleCloseModal(false)
						});
					});
			})
			.catch(error => {
				setOnModal({
					status: true,
					msg: "Error cargando sitios del servidor: " + error,
					fClose: () => handleCloseModal(false)
				});
			});
	}, []);

	const testToken = async () => {
		try {
			// test token validity
			let res = await actions.getUser();
			let resj = await res.json();
			if (res.status >= 400) {
				setOnModal({ status: true, msg: resj["msg"], fClose: () => handleCloseModal(true) });
			}
		} catch (error) {
			setOnModal({
				status: true,
				msg: "Error en la conexión con el servidor: " + error,
				fClose: () => handleCloseModal(false)
			});
		}
	};

	let [sug, setSug] = useState([]);

	const handleChange = e => {
		let key = e.target.value;
		if (key.length == 1) {
			actions
				.getBrowsePlace(key)
				.then(res => res.json())
				.then(data => setSug(data.map(e => e["name"])))
				.catch(error => {
					setOnModal({
						status: true,
						msg: "Error al cargar sitio del servidor: " + error,
						fClose: () => handleCloseModal(false)
					});
				});
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
					} else {
						setOnModal({
							status: true,
							msg: "Lista de datos vacía: " + error,
							fClose: () => handleCloseModal(false)
						});
					}
				})
				.catch(error => {
					setOnModal({
						status: true,
						msg: "Error al buscar sitio en el servidor: " + error,
						fClose: () => handleCloseModal(false)
					});
				});
		}
	};

	// Set the atribute mywidth, to adjust size of map.
	window.onresize = () => setData({ ...data, mywidth: window.innerWidth });

	return (
		<div className="container-fluid text-center mt-4">
			<div className="row">
				<div className="color-one" style={{ fontFamily: "IM Fell Great Primer SC", fontSize: "4rem" }}>
					MovTour
				</div>
				<div className="text-light fs-2" style={{ fontFamily: "Playfair Display" }}>
					“The world isnt in your books and maps, it is out there.” ―
					<span className="fst-italic"> The Hobbit, J.R.R. Tolkien</span>
				</div>
				<form className="d-flex justify-content-center my-5 p-3" onSubmit={handleSearch}>
					<input
						id="mySearch"
						type="search"
						list="suggestions"
						className="form-control rounded-pill fs-4 shadow-one bg-light"
						placeholder="Buscar un lugar"
						onChange={handleChange}
						style={{ width: "40rem" }}
					/>
					<button
						type="submit"
						className="btn btn-dark rounded-pill bg-one color-two fw-bold fs-5 shadow-one"
						onSubmit={handleSearch}
						style={{ width: "10rem" }}>
						IR
					</button>
					<datalist id="suggestions">
						{sug ? sug.map((e, i) => <option key={i} data-value={i} value={e} />) : ""}
					</datalist>
				</form>

				{data.place ? (
					<div className="rounded bg-dark border-one col-9 mx-auto my-3 pt-3 row d-flex justify-content-evenly shadow-one">
						<div className="card bg-transparent border-0 col-lg-5 col-sm-10 title-one">
							<h3 className="text-light mb-3">Sitio de rodaje recomendado:</h3>
							<img
								src={data.place.urlPhoto}
								className="mx-auto col-10"
								alt={data.place.name}
								style={{ objectFit: "cover", height: "20rem" }}
							/>
							<div className="card-body mb-3">
								<h4 className="card-title mb-3 color-one">{data.place.name}</h4>
								<Link to={"/place/" + data.place.id}>
									<button type="button" className="btn-link">
										Aprender más
									</button>
								</Link>
								{store.activeUser.id ? (
									<span className="btn-like" onClick={() => handleLike(data.place.id)}>
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

						<div className="card bg-transparent border-0 col-lg-5 col-sm-10 title-one">
							<h3 className="text-light mb-3">Película recomendada:</h3>
							<img
								src={data.film.urlPhoto}
								className="mx-auto col-10"
								alt={data.film.name}
								style={{ objectFit: "cover", height: "20rem" }}
							/>
							<div className="card-body">
								<h4 className="card-title mb-3 color-one">{data.film.name}</h4>
								<Link to={"/infofilms/" + data.film.id}>
									<button type="button" className="btn-link">
										Aprender más
									</button>
								</Link>
							</div>
						</div>
					</div>
				) : (
					""
				)}

				{data.markerPositions.length > 0 ? (
					<div className="rounded bg-dark border-one col-9 mx-auto mt-4 pt-3 mb-5 shadow-one">
						<h3 className="text-light title-one">Explora todos nuestros sitios de rodaje:</h3>
						<div className="card rounded mb-3 mx-auto" style={{ width: "max-content" }}>
							<Map
								markers={data.markerPositions}
								zoom={2}
								width={Math.floor(data.mywidth * 0.68).toString()}
								height={Math.floor(data.mywidth * 0.4).toString()}
								center={{ lat: 40.416775, lng: 3.70379 }}
							/>
						</div>
					</div>
				) : (
					""
				)}
				{onModal.status ? <ModalMsg msg={onModal.msg} closeFunc={onModal.fClose} cancelFunc={null} /> : ""}
			</div>
		</div>
	);
};
