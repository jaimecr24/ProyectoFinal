import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);
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
			<h1 className="text-white">MovTour</h1>
			<h4 className="text-white">
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
			<iframe
				className="mx-auto"
				src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26432.43434605815!2d-118.34398771265504!3d34.09374955803937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bf07045279bf%3A0xf67a9a6797bdfae4!2sHollywood%2C%20Los%20%C3%81ngeles%2C%20California%2C%20EE.%20UU.!5e0!3m2!1ses!2ses!4v1638286747086!5m2!1ses!2ses"
				style={{ width: "45rem", height: "25rem" }}
			/>
		</div>
	);
};
