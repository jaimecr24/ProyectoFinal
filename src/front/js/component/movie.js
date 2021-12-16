import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export const Movie = props => {
	const { store, actions } = useContext(Context);

	return (
		<div className="card bg-dark">
			<img src={props.picture} className="characters card-img-top mx-auto" alt="..." />
			<div className="card-body">
				<h5 className="card-title text-warning" style={{ textAlign: "center", paddingBottom: "40px" }}>
					{props.place}, {props.country}
				</h5>
				<a className="btn btn-primary float-start">
					<span className="text-warning ">
						{" "}
						<span className="btn btn-outline-primary">
							<span className="btn btn-outline-primary">
								<Link to={"/place/" + props.id}>
									<span className="btn btn-outline-primary">Aprender más</span>
								</Link>
							</span>
						</span>
					</span>
				</a>
				<button className="btn btn-outline-warning float-end">
					<i className="fas fa-heart" />
				</button>
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
