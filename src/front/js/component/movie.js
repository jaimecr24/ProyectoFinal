import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export const Movie = props => {
	const { store, actions } = useContext(Context);

	const isLiked = idPlace => store.activeUser.listFav.includes(idPlace);
	const handleLike = idPlace => {
		isLiked(idPlace) ? actions.delFavPlace(idPlace) : actions.addFavPlace(idPlace);
	};

	return (
		<div className="design-card border border bg-dark title-one" style={{ borderColor: "#fa9f42" }}>
			<img
				src={props.picture}
				className="characters card-img-top mx-auto"
				style={{ objectFit: "cover", width: "100%" }}
			/>
			<div className="card-body">
				<h5
					className="card-title-text"
					style={{ textAlign: "center", paddingBottom: "40px", color: "#fa9f42" }}>
					{props.place}, {props.country}
				</h5>
				<Link to={"/place/" + props.id}>
					<button type="button" className="btn-link">
						Aprender más
					</button>
				</Link>
				{store.activeUser.id ? (
					<span className="btn-like" onClick={() => handleLike(props.id)}>
						{isLiked(props.id) ? <i className="fas fa-heart" /> : <i className="far fa-heart" />}
					</span>
				) : null}
			</div>
		</div>
	);
};

Movie.propTypes = {
	id: PropTypes.number,
	place: PropTypes.string,
	country: PropTypes.string,
	urlPhoto: PropTypes.string,
	picture: PropTypes.string
};
