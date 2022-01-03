const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			activeUser: { token: "", id: null, lastTime: null, category: false },
			singlePlace: null,
			infoFilms: null,
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
			logout: () => setStore({ activeUser: { token: "", id: null, lastTime: null, category: false } }),

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

			// Protected: add a single place in favorites of user
			addFavPlace: idPlace => {
				return fetch(process.env.BACKEND_URL + "/api/favorite/" + idPlace.toString(), {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + getStore().activeUser.token
					}
				});
			},

			// Protected: delete a single place in favorites of user
			delFavPlace: idPlace => {
				return fetch(process.env.BACKEND_URL + "/api/favorite/" + idPlace.toString(), {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + getStore().activeUser.token
					}
				});
			},

			getPlacePhotos: idPlace => {
				return fetch(process.env.BACKEND_URL + "/api/place/" + idPlace.toString() + "/photos");
			},

			// Get the list of places that match a key (only name and id)
			getBrowsePlace: key => fetch(process.env.BACKEND_URL + "/api/browse/" + key),

			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: () => {
				// fetching data from the backend
				fetch(process.env.BACKEND_URL + "/api/hello")
					.then(resp => resp.json())
					.then(data => setStore({ message: data.message }))
					.catch(error => console.log("Error loading message from backend", error));
			},
			getPlaces: () => {
				// fetching data from the backend
				console.log(process.env.BACKEND_URL + "/api/places");
				//fetch(process.env.BACKEND_URL + "api/places")
				fetch(process.env.BACKEND_URL + "/api/places")
					.then(resp => resp.json())
					.then(data => setStore({ places: data }))
					.catch(error => console.log("Error loading places from backend", error));
			},
			getSinglePlace: id => {
				fetch(process.env.BACKEND_URL + "/api/places/" + id)
					.then(res => res.json())
					.then(data => {
						setStore({
							singlePlace: data
						});
					})
					.catch(error => console.log("Error loading place from backend", error));
			},
			getScenesByPlace: id => {
				fetch(process.env.BACKEND_URL + "/api/scenes/place/" + id)
					.then(res => res.json())
					.then(data => {
						setStore({
							scenesByPlace: data
						});
					})
					.catch(error => console.log("Error loading place from backend", error));
			},

			getScenesByFilm: id => {
				fetch(process.env.BACKEND_URL + "/api/scenes/film/" + id)
					.then(res => res.json())
					.then(data => {
						console.log(data);
						setStore({
							scenesByFilm: data
						});
					})
					.catch(error => console.log("Error loading place from backend", error));
			},

			fetchFilms: () => {
				console.log(process.env.BACKEND_URL + "/api/films");
				fetch(process.env.BACKEND_URL + "/api/films")
					.then(resp => resp.json())
					.then(data => setStore({ films: data }))
					.catch(error => console.log("Error loading message from backend", error));
			},

			getInfoFilms: id => {
				fetch(process.env.BACKEND_URL + "/api/films/" + id)
					.then(res => res.json())
					.then(data => {
						console.log(data);
						setStore({
							infoFilms: data
						});
						return data.id;
					})
					.then(id => getActions().getScenesByFilm(id))
					.catch(error => console.log("Error loading place from backend", error));
			},

			resetInfoFilms: () => {
				setStore({
					infoFilms: null
				});
				localStorage.removeItem("id");
			},
			fetchCountries: () => {
				console.log(process.env.BACKEND_URL + "/api/countries");
				fetch(process.env.BACKEND_URL + "/api/countries")
					.then(resp => resp.json())
					.then(data => setStore({ countries: data }))
					.catch(error => console.log("Error loading message from backend", error));
			},

			getInfoCountries: id => {
				fetch(process.env.BACKEND_URL + "/api/countries/" + id)
					.then(res => res.json())
					.then(data => {
						console.log(data);
						setStore({
							infoCountries: data
						});
						return data.id;
					})
					.then(id => getActions().getScenesByFilm(id))
					.catch(error => console.log("Error loading place from backend", error));
			},
			resetInfoCountries: () => {
				setStore({
					infoCountries: null
				});
				localStorage.removeItem("id");
			},

			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},

			getMarkerPositions: places => {
				let markerPositions = [{}];

				places.map(place =>
					markerPositions.push({
						position: { lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) },
						content:
							"<img class='w-50'  src = '" +
							place.urlPhoto +
							"'/>" +
							"<p><b>" +
							place.name +
							"</b></p><p>" +
							place.address +
							"</p>" +
							"<a href='/place/" +
							place.id +
							"'>Ver más</a>"
					})
				);

				return markerPositions;
			},
			getSingleMarkerPosition: place => {
				let markerPositions = [
					{
						position: { lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) },
						content: "<p><b>" + place.name + "</b></p><p>" + place.address + "</p>"
					}
				];

				return markerPositions;
			}
		}
	};
};

export default getState;
