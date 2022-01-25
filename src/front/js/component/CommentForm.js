import React, { useState } from "react";
import PropTypes from "prop-types";

const CommentForm = ({ handleSubmit, submitLabel, hasCancelButton = false, handleCancel, initialText = "" }) => {
	const [text, setText] = useState(initialText);
	const isTextareaDisabled = text.length === 0;
	const onSubmit = event => {
		event.preventDefault();
		handleSubmit(text);
		setText("");
	};
	return (
		<form onSubmit={onSubmit}>
			<textarea className="comment-form-textarea" value={text} onChange={e => setText(e.target.value)} />
			<button
				className="comment-form-button btn btn-outline"
				disabled={isTextareaDisabled}
				style={{ backgroundColor: "#fa9f42", borderRadius: "50px" }}>
				{submitLabel}
			</button>
			{hasCancelButton && (
				<button type="button" className="comment-form-button comment-form-cancel-button" onClick={handleCancel}>
					Cancel
				</button>
			)}
		</form>
	);
};

export default CommentForm;

CommentForm.propTypes = {
	handleSubmit: PropTypes.func,
	submitLabel: PropTypes.string,
	hasCancelButton: PropTypes.bool,
	handleCancel: PropTypes.func,
	initialText: PropTypes.string
};
