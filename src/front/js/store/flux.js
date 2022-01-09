const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			activeUser: { token: "", id: null, lastTime: null, category: false, listFav: [] },
			singlePlace: null,
			infoCountries: null
		},
		actions: {
			//Add a new user. Category is always false except for administrator.
			addUser: (name, lastname, username, email, password, category = false) => {
				return fetch(process.env.BACKEND_URL + "/api/signup", {
					method: "POST",
					body: JSON.stringify({
						name: name,
						lastname: lastname,
						username: username,
						email: email,
						password: password,
						category: category
					}),
					headers: {
						"Content-Type": "application/json"
					}
				});
			},

			// Login the user by email or username. In response there will be the last time login.
			login: (email, username, password) => {
				return fetch(process.env.BACKEND_URL + "/api/login", {
					method: "POST",
					body: JSON.stringify({ email: email, username: username, password: password }),
					headers: {
						"Content-Type": "application/json"
					}
				});
			},
			setActiveUser: p => setStore({ activeUser: p }),

			// Logout. Reset all variables related to user
			logout: () =>
				setStore({ activeUser: { token: "", id: null, lastTime: null, category: false, listFav: [] } }),

			// Protected: get all data from user identified by token
			getUser: () => {
				return fetch(process.env.BACKEND_URL + "/api/profile", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + getStore().activeUser.token
					}
				});
			},

			// Protected: get all favorite places from user identified by token
			getFavPlaces: () => {
				return fetch(process.env.BACKEND_URL + "/api/favorites", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + getStore().activeUser.token
					}
				});
			},

			// Protected: add a single place in favorites of user.
			// Updates listFav of activeUser in store and CountLikes of place in backend.
			addFavPlace: idPlace => {
				fetch(process.env.BACKEND_URL + "/api/favorite/" + idPlace.toString(), {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + getStore().activeUser.token
					}
				})
					.then(res => res.json())
					.then(res => {
						let aux = getStore().activeUser;
						if (!aux.listFav.includes(idPlace)) {
							aux.listFav.push(idPlace);
							setStore({ activeUser: aux });
						}
					})
					.catch(error => alert("Error adding favorite place: " + error));
			},

			// Protected: delete a single place in favorites of user
			// Updates listFav of activeUser in store and CountLikes of place in backend
			delFavPlace: async idPlace => {
				try {
					const res = await fetch(process.env.BACKEND_URL + "/api/favorite/" + idPlace.toString(), {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
							Authorization: "Bearer " + getStore().activeUser.token
						}
					});
					const res_1 = await res.json();
					let aux = getStore().activeUser;
					aux.listFav = aux.listFav.filter(e => e !== idPlace);
					setStore({ activeUser: aux });
					return res_1;
				} catch (error) {
					return alert("Error removing favorite place: " + error);
				}
			},

			getPlacePhotos: idPlace => {
				return fetch(process.env.BACKEND_URL + "/api/place/" + idPlace.toString() + "/photos");
			},

			// Get the list of places that match a key (only name and id)
			getBrowsePlace: key => fetch(process.env.BACKEND_URL + "/api/browse/" + key),

			// Get the list of all places in db.
			getPlaces: () => fetch(process.env.BACKEND_URL + "/api/places"),

			// Get data of a single place.
			getSinglePlace: id => fetch(process.env.BACKEND_URL + "/api/places/" + id),

			// Get the list of scenes filmmed on a single place.
			getScenesByPlace: id => fetch(process.env.BACKEND_URL + "/api/scenes/place/" + id),

			// Get the scenes of a single film.
			getScenesByFilm: id => fetch(process.env.BACKEND_URL + "/api/scenes/film/" + id),

			// Get all films.
			fetchFilms: () => fetch(process.env.BACKEND_URL + "/api/films"),

			// Get the info of a single film.
			getInfoFilm: id => fetch(process.env.BACKEND_URL + "/api/films/" + id),

			// Get a random film.
			getRandomFilm: () => fetch(process.env.BACKEND_URL + "/api/films/random"),

			// Get all countries.
			fetchCountries: () => fetch(process.env.BACKEND_URL + "/api/countries"),

			// Get info of a single country.
			getInfoCountries: id => fetch(process.env.BACKEND_URL + "/api/countries/" + id),

			// Get list of films filmmed on a country
			getFilmsByCountry: id => fetch(process.env.BACKEND_URL + "/api/films/country/" + id),

			resetInfoCountries: () => {
				setStore({
					infoCountries: null
				});
				localStorage.removeItem("id");
			},

			getComments: place => {
				return fetch(process.env.BACKEND_URL + `/api/comments?place=${place}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + getStore().activeUser.token
					}
				}).then(res => res.json());
			},

			addComment: (body, idPlace, parentId) => {
				return fetch(process.env.BACKEND_URL + "/api/comments", {
					method: "POST",
					body: JSON.stringify({
						body: body,
						parentId: parentId,
						idPlace: idPlace
					}),
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + getStore().activeUser.token
					}
				}).then(res => res.json());
			},

			deleteComment: idComment => {
				return fetch(process.env.BACKEND_URL + "/api/comments-removed/" + idComment, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + getStore().activeUser.token
					}
				});
			},

			getMarkerPositions: places =>
				places.map(place => {
					return {
						position: { lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) },
						content:
							"<img class='w-50'  src = '" +
							place.urlPhoto +
							"'/>" +
							"<p><b>" +
							place.name +
							"</b></p><p>" +
							(place.address ? place.address : "") +
							"</p>" +
							"<a href='/place/" +
							place.id +
							"'>Ver más</a>"
					};
				}),

			getSingleMarkerPosition: place => {
				return [
					{
						position: { lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) },
						content: "<p><b>" + place.name + "</b></p><p>" + place.address + "</p>"
					}
				];
			}
		}
	};
};

export default getState;
