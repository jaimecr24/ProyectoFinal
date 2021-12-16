import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export const Country = props => {
	const { store, actions } = useContext(Context);

	return (
		<div className="card bg-dark">
			<img src={props.picture} className="characters card-img-top mx-auto" alt="..." />
			<div className="card-body">
				<h5 className="card-title text-warning" style={{ textAlign: "center", paddingBottom: "40px" }}>
					{props.movie}
				</h5>
				<a className="btn btn-primary float-start">
					<span className="text-warning ">
						{" "}
						<Link to={"/infofilms/" + props.id}>
							<span className="btn btn-outline-primary">Aprender más</span>
						</Link>
					</span>
				</a>
				<button className="btn btn-outline-warning float-end">
					<i className="fas fa-heart" />
				</button>
			</div>
		</div>
	);
};

Country.propTypes = {
	id: PropTypes.string,
	picture: PropTypes.string,
	movie: PropTypes.string
};
