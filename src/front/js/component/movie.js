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
		<div className="design-card border border bg-dark" style={{ borderColor: "#fa9f42" }}>
			<img
				src={props.picture}
				className="characters card-img-top mx-auto"
				alt="..."
				style={{ objectFit: "cover", width: "100%" }}
			/>
			<div className="card-body">
				<h5
					className="title card-title-text"
					style={{ textAlign: "center", paddingBottom: "40px", color: "#fa9f42" }}>
					{props.place}, {props.country}
				</h5>
				<Link to={"/place/" + props.id}>
					<span className="btn btn-outline" style={{ borderRadius: "50px", padding: "20px, 48px" }}>
						Aprender más
					</span>
				</Link>
				{store.activeUser.id ? (
					<span className="btn btn-outline-danger ms-1" onClick={() => handleLike(props.id)}>
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
