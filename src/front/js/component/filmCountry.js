import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export const FilmCountry = props => {
	return (
		<div className="design-card border border bg-dark">
			<img
				src={props.filmPhoto}
				className="characters card-img-top mx-auto"
				alt="..."
				style={{ objectFit: "cover", width: "100%" }}
			/>
			<div className="card-body">
				<h5
					className="title card-title-text"
					style={{ textAlign: "center", paddingBottom: "40px", color: "#fa9f42" }}>
					{props.movie}
				</h5>

				<Link to={"/infofilms/" + props.id}>
					<span className="btn btn-outline" style={{ borderRadius: "50px", padding: "20px, 48px" }}>
						Aprender más
					</span>
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
