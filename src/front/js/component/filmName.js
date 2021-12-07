import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import PropTypes from "prop-types";

export const FilmName = props => {
	const { store, actions } = useContext(Context);
	useEffect(() => {
		actions.getInfoFilms(props.id);
	}, []);


	return (
		<div>
            {store.infoFilms ? store.infoFilms.name : null}

		</div>
	);
};
FilmName.propTypes = {
	id: PropTypes.string,
};
