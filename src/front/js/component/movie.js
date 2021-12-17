import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export const Movie = props => {
	const { store, actions } = useContext(Context);

	return (
		<div className="design-card border border bg-dark" style={{ borderColor: "#fa9f42" }}>
			<img src={props.picture} className="characters card-img-top mx-auto" alt="..." />
			<div className="card-body">
				<h5 className="card-title" style={{ textAlign: "center", paddingBottom: "40px", color: "#fa9f42" }}>
					{props.place}, {props.country}
				</h5>

				<Link to={"/place/" + props.id}>
					<span className="btn btn-outline">Aprender más</span>
				</Link>
			</div>
		</div>
	);
};

Movie.propTypes = {
	id: PropTypes.string,
	place: PropTypes.string,
	country: PropTypes.string,
	urlPhoto: PropTypes.string,
	picture: PropTypes.string
};
