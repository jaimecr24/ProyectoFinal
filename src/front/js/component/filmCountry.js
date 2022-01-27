import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export const FilmCountry = props => {
	return (
		<div className="design-card border bg-dark">
			<img
				src={props.filmPhoto}
				className="characters card-img-top mx-auto"
				alt="..."
				style={{ objectFit: "cover", width: "100%" }}
			/>
			<div className="card-body">
				<h5
					className="card-title-text"
					style={{ textAlign: "center", paddingBottom: "40px", color: "#fa9f42" }}>
					{props.movie}
				</h5>

				<Link to={"/infofilms/" + props.id}>
					<button type="button" className="btn-link">
						Aprender más
					</button>
				</Link>
			</div>
		</div>
	);
};

FilmCountry.propTypes = {
	id: PropTypes.number,
	filmPhoto: PropTypes.string,
	movie: PropTypes.string
};
