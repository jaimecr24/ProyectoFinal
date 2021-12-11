import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import Map from "../component/map.js";

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
				<div className="d-flex justify-content-center">
					<Map
						lat={26.01128}
						lng={-80.142967}
						width="600"
						height="350"
						name="Hollywood"
						direction="Hollywood Blvd Hollywood, CA 90028"
					/>
				</div>
			</div>
		</div>
	);
};
