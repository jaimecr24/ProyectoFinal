import React from "react";
import PropTypes from "prop-types";

const ModalMsg = props => (
	<div className="custom-modal d-flex align-items-center justify-content-center text-center">
		<div
			className="custom-modal-content border border-3 border-warning rounded-3 text-white profile fs-4"
			style={{ background: "rgba(43, 65, 98, 0.8)" }}>
			<div className="m-4">{props.msg}</div>
			{props.cancelFunc ? (
				// Two buttons: one for close/accept, other for close
				<div className="mx-5">
					<button className="btn btn-warning mb-4 fs-4" onClick={props.closeFunc}>
						Aceptar
					</button>
					<button className="btn btn-light mb-4 ms-4 fs-4" onClick={props.cancelFunc}>
						Cancelar
					</button>
				</div>
			) : (
				// Only one button for close/accept.
				<button className="btn btn-warning mb-4 fs-4 mx-5" onClick={props.closeFunc}>
					Aceptar
				</button>
			)}
		</div>
	</div>
);

ModalMsg.propTypes = {
	msg: PropTypes.string,
	closeFunc: PropTypes.func,
	cancelFunc: PropTypes.func
};

export default ModalMsg;
