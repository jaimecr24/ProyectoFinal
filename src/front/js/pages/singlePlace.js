import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Scene } from "../component/scene.js";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Map from "../component/map.js";
import Comments from "../component/Comments.js";
import ModalMsg from "../component/modalmsg";

export const SinglePlace = () => {
	const { actions, store } = useContext(Context);
	const params = useParams();

	// variable to show modal messages and function to close modal.
	const [onModal, setOnModal] = useState({ status: false, msg: "", fClose: null });
	const handleCloseModal = bLogout => {
		setOnModal({ status: false, msg: "", fClose: null });
		if (bLogout) actions.logout();
	};
	const [data, setData] = useState({
		mywidth: 0,
		place: null,
		scenes: [],
		markerPositions: [],
		liked: false //Used for show the symbol heart as liked or not liked.
	});

	useEffect(() => {
		if (store.activeUser.id) testToken();
		// Get data of a single place
		actions
			.getSinglePlace(params.theid)
			.then(res => res.json())
			.then(myplace => {
				// Get data of scenes
				actions
					.getScenesByPlace(params.theid)
					.then(res => res.json())
					.then(myscenes => {
						// order scenes by title of film
						myscenes.sort((a, b) => (a.title > b.title ? 1 : b.title > a.title ? -1 : 0));
						// Now we set all data in variable of state.
						setData({
							mywidth: window.innerWidth,
							place: myplace,
							scenes: myscenes,
							markerPositions: actions.getSingleMarkerPosition(myplace),
							liked: store.activeUser.id ? store.activeUser.listFav.includes(myplace.id) : false
						});
					})
					.catch(error => {
						setOnModal({
							status: true,
							msg: "Error cargando escenas del servidor: " + error,
							fClose: () => handleCloseModal(false)
						});
					});
			})
			.catch(error => {
				setOnModal({
					status: true,
					msg: "Error cargando datos del sitio desde el servidor: " + error,
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

	const handleLike = () => {
		let prevCount = data.place.countLikes;
		let sum = 0;
		if (data.liked) {
			actions.delFavPlace(data.place.id);
			sum = -1;
		} else {
			actions.addFavPlace(data.place.id);
			sum = +1;
		}
		setData({
			...data,
			liked: !data.liked,
			place: { ...data.place, countLikes: prevCount + sum }
		});
	};

	// Set the atribute mywidth, to adjust size of map.
	window.onresize = () => setData({ ...data, mywidth: window.innerWidth });

	return (
		<>
			<div className="container mt-3 p-3 mx-auto bg-dark text-light border-one rounded">
				{data.place ? (
					<div>
						<h2 className="color-one ms-4 ps-2 mt-2 title-one">
							{data.place.name}
							<Link to={"/infocountries/" + data.place.idCountry} style={{ textDecoration: "none" }}>
								<p className="color-one fs-4">{data.place.countryName}</p>
							</Link>
						</h2>
						<div className="mx-auto ms-lg-4 row">
							<div className="col-lg-5 col-sm-12 mt-2 me-lg-4">
								<img
									className="col-12"
									src={data.place.urlPhoto}
									style={{ height: "20rem", objectFit: "cover" }}
								/>
								<div className="text-light mt-3">
									{store.activeUser.id ? (
										<span className="btn-like" onClick={handleLike}>
											{data.liked ? (
												<i className="fas fa-heart" />
											) : (
												<i className="far fa-heart" />
											)}
										</span>
									) : (
										""
									)}
									<span className="ms-2">Likes: {data.place.countLikes}</span>
								</div>
							</div>
							<div className="col-lg-6 col-sm-12 mt-3">
								<p className="text-light">{data.place.description}</p>
							</div>
						</div>

						<h5 className="mt-5 mb-4 ms-5 title-one">¿Dónde encontrar {data.place.name}?</h5>
						<div className="my-3 d-flex justify-content-center">
							{data.markerPositions.length > 0 ? (
								<Map
									markers={data.markerPositions}
									zoom={10}
									width={Math.floor(data.mywidth * 0.5).toString()}
									height={Math.floor(data.mywidth * 0.2).toString()}
									center={data.markerPositions[0].position}
								/>
							) : (
								""
							)}
						</div>

						{data.scenes.length > 0 ? (
							<div className="row mt-5 px-5">
								<h5 className="ms-4 title-one">Escenas rodadas en {data.place.name}:</h5>
								{data.scenes.map(value => (
									<Scene
										id={value.idFilm}
										description={value.description}
										title={value.title}
										urlPhoto={value.urlPhoto}
										key={value.idFilm}
										spoiler={value.spoiler}
									/>
								))}
							</div>
						) : (
							""
						)}
						{store.activeUser.id ? <Comments idPlace={parseInt(params.theid)} /> : ""}
					</div>
				) : (
					""
				)}
			</div>
			{onModal.status ? <ModalMsg msg={onModal.msg} closeFunc={onModal.fClose} cancelFunc={null} /> : ""}
		</>
	);
};
