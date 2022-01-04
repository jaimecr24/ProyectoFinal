import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export const FilmCountry = props => {
	const { store, actions } = useContext(Context);

	return (
		<div className="design-card border border bg-dark">
			<img src={props.filmPhoto} className="characters card-img-top mx-auto" alt="..." />
			<div className="card-body">
				<h5 className="card-title" style={{ textAlign: "center", paddingBottom: "40px", color: "#fa9f42" }}>
					{props.movie}
				</h5>

				<Link to={"/infofilms/" + props.id}>
					<span className="btn btn-outline">Aprender más</span>
				</Link>
			</div>
		</div>
	);
};

FilmCountry.propTypes = {
	id: PropTypes.string,
	filmPhoto: PropTypes.string,
	movie: PropTypes.string
};
