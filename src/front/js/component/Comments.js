import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import ModalMsg from "../component/modalmsg";
import PropTypes from "prop-types";

const Comments = props => {
	const { store, actions } = useContext(Context);

	// variable to show modal messages and function to close modal.
	const [onModal, setOnModal] = useState({ status: false, msg: "", fClose: null, fCancel: null });
	const handleCloseModal = bLogout => {
		setOnModal({ status: false, msg: "", fClose: null, fCancel: null });
		if (bLogout) actions.logout(); // close user session
	};

	// Comments list
	const [backendComments, setBackendComments] = useState([]);

	// Active comment on edit mode ??
	const [activeComment, setActiveComment] = useState(null);

	// List of root comments (whithout parent)
	// If backendComments is null the second operand isn't evaluated
	const rootComments = backendComments && backendComments.filter(e => e.parentId === null);

	// Function: get list ordered by date of replies to comment.
	const getReplies = commentId =>
		backendComments
			.filter(backendComment => backendComment.parentId === commentId)
			.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

	// Function: add a comment to list backendComments
	const addComment = async (text, parentId) => {
		try {
			let res = await actions.addComment(text, props.idPlace, parentId);
			let comment = await res.json();
			if (res.status >= 400) {
				setOnModal({ status: true, msg: comment["msg"], fClose: () => handleCloseModal(true), fCancel: null });
			} else {
				setBackendComments([...(backendComments || []), comment]);
				setActiveComment(null);
			}
		} catch (error) {
			setOnModal({
				status: true,
				msg: "Error en la conexión con el servidor: " + error,
				fClose: () => handleCloseModal(false),
				fCancel: null
			});
		}
	};

	// Function: update a comment
	const updateComment = (text, commentId) => {
		/*actions.updateComment(text).then(() => {
			// updates the body property of element who has id = commentId
			const updatedBackendComments = backendComments.map(backendComment => {
				if (backendComment.id === commentId) {
					return { ...backendComment, body: text };
				}
				return backendComment;
			});
			setBackendComments(updatedBackendComments);
			setActiveComment(null);
		);*/
	};

	const deleteComment = commentId => {
		setOnModal({
			status: true,
			msg: "¿Eliminar comentario?",
			fClose: () => __deleteComment(commentId),
			fCancel: () => handleCloseModal(false)
		});
	};

	// Internal function to delete element with modal window to confirm.
	const __deleteComment = async commentId => {
		try {
			let res = await actions.deleteComment(commentId);
			let resj = await res.json();
			if (res.status >= 400) {
				setOnModal({ status: true, msg: resj["msg"], fClose: () => handleCloseModal(true), fCancel: null });
			} else {
				// Update list of backendComments
				const updatedBackendComments = backendComments.filter(
					backendComment => backendComment.id !== commentId
				);
				setBackendComments(updatedBackendComments);
				handleCloseModal(false);
			}
		} catch (error) {
			setOnModal({
				status: true,
				msg: "Error en la conexión con el servidor: " + error,
				fClose: () => handleCloseModal(false),
				fCancel: null
			});
		}
	};

	const getComments = async idPlace => {
		try {
			let res = await actions.getComments(idPlace);
			let data = await res.json();
			if (res.status >= 400) {
				setOnModal({ status: true, msg: data["msg"], fClose: () => handleCloseModal(true), fCancel: null });
			} else {
				setBackendComments(data.items);
			}
		} catch (error) {
			setOnModal({
				status: true,
				msg: "Error en la conexión con el servidor: " + error,
				fClose: () => handleCloseModal(false),
				fCancel: null
			});
		}
	};

	// Load the comments about the current place
	useEffect(() => {
		getComments(props.idPlace);
	}, []);

	return (
		<>
			<div className="comments">
				<h3 className="comments-title">¿Has visitado este sitio?</h3>
				<div className="comment-form-title">¡Añade un comentario! </div>
				<CommentForm submitLabel="Añadir" handleSubmit={addComment} />
				<div className="comments-container">
					{rootComments && // Test root coments != null
						rootComments.map(rootComment => (
							<Comment
								key={rootComment.id}
								comment={rootComment}
								replies={getReplies(rootComment.id)}
								getReplies={getReplies}
								activeComment={activeComment}
								setActiveComment={setActiveComment}
								addComment={addComment}
								deleteComment={deleteComment}
								updateComment={updateComment}
								currentUserId={store.activeUser.id}
							/>
						))}
				</div>
			</div>
			{onModal.status ? (
				<ModalMsg msg={onModal.msg} closeFunc={onModal.fClose} cancelFunc={onModal.fCancel} />
			) : (
				""
			)}
		</>
	);
};

export default Comments;

Comments.propTypes = { idPlace: PropTypes.number };
