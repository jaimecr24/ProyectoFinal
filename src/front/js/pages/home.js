import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import icon from "../../img/icon.png";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	const style = {
		width: "200px"
	};
	const cardStyle = {
		width: "15rem"
	};

	return (
		<div className="text-center mt-3">
			<h1>MovTour</h1>

			<p>“The world isnt in your books and maps, it is out there.” ― The Hobbit, J.R.R. Tolkien</p>
			<div className="row">
				<div className="col-6 offset-3">
					<div className="input-group">
						<input
							type="search"
							className="form-control rounded"
							placeholder="Search"
							aria-label="Search"
							aria-describedby="search-addon"
						/>
						<button type="button" className="btn btn-dark">
							search
						</button>
					</div>
				</div>
			</div>
			<br />
			<div className="row">
				<div className="offset-3 col-6 offset-3">
					<iframe
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26432.43434605815!2d-118.34398771265504!3d34.09374955803937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bf07045279bf%3A0xf67a9a6797bdfae4!2sHollywood%2C%20Los%20%C3%81ngeles%2C%20California%2C%20EE.%20UU.!5e0!3m2!1ses!2ses!4v1638286747086!5m2!1ses!2ses"
						style={{ width: "600px", height: "350px" }}
					/>
				</div>
			</div>
		</div>
	);
};
