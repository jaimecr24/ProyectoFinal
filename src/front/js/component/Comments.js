import { useState, useEffect, useContext } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Context } from "../store/appContext";

const Comments = ({ commentsUrl, currentUserId, place }) => {
	const { actions } = useContext(Context);
	const [backendComments, setBackendComments] = useState([]);
	const [activeComment, setActiveComment] = useState(null);
	const rootComments = backendComments && backendComments.filter(backendComment => backendComment.parentId === null);
	const getReplies = commentId =>
		backendComments
			.filter(backendComment => backendComment.parentId === commentId)
			.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
	const addComment = (text, parentId) => {
		actions.addComment(text, place, parentId).then(comment => {
			console.log(backendComments);
			setBackendComments([comment, ...(backendComments || [])]);
			console.log(comment);
			setActiveComment(null);
		});
	};

	const updateComment = (text, commentId) => {
		updateComment(text).then(() => {
			const updatedBackendComments = backendComments.map(backendComment => {
				if (backendComment.id === commentId) {
					return { ...backendComment, body: text };
				}
				return backendComment;
			});
			setBackendComments(updatedBackendComments);
			setActiveComment(null);
		});
	};
	const deleteComment = commentId => {
		if (window.confirm("Are you sure you want to remove comment?")) {
			actions.deleteComment(commentId).then(() => {
				const updatedBackendComments = backendComments.filter(
					backendComment => backendComment.id !== commentId
				);
				setBackendComments(updatedBackendComments);
			});
		}
	};

	useEffect(() => {
		actions.getComments(place).then(data => {
			setBackendComments(data.items);
		});
	}, []);

	return (
		<div className="comments">
			<h3 className="comments-title">Has visitado este sitio?</h3>
			<div className="comment-form-title">Añade un comentario! </div>
			<CommentForm submitLabel="Añadir" handleSubmit={addComment} />
			<div className="comments-container">
				{rootComments &&
					rootComments.map(rootComment => (
						<Comment
							key={rootComment.id}
							comment={rootComment}
							replies={getReplies(rootComment.id)}
							activeComment={activeComment}
							setActiveComment={setActiveComment}
							addComment={addComment}
							deleteComment={deleteComment}
							updateComment={updateComment}
							currentUserId={currentUserId}
						/>
					))}
			</div>
		</div>
	);
};

export default Comments;

Comments.propTypes = {
	commentsUrl: PropTypes.string,
	currentUserId: PropTypes.string,
	place: PropTypes.string
};
