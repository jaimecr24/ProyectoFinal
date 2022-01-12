import React from "react";
import PropTypes from "prop-types";

const ModalMsg = props => (
	<div className="custom-modal d-flex align-items-center">
		<div
			className="custom-modal-content mx-auto border border-3 border-warning rounded-3 text-white profile fs-4"
			style={{ background: "rgba(43, 65, 98, 0.8)" }}>
			<div className="m-4">{props.msg}</div>
			<button className="btn btn-warning mb-4 fs-4" onClick={props.closeFunc}>
				Cerrar
			</button>
		</div>
	</div>
);

ModalMsg.propTypes = {
	msg: PropTypes.string,
	closeFunc: PropTypes.func
};

export default ModalMsg;
