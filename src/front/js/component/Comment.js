import CommentForm from "./CommentForm";
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import profileImgUrl from "../../img/profile.png";

const Comment = ({
	comment,
	replies,
	setActiveComment,
	activeComment,
	updateComment,
	deleteComment,
	addComment,
	parentId = null,
	currentUserId
}) => {
	const isEditing = activeComment && activeComment.id === comment.id && activeComment.type === "editing";
	const isReplying = activeComment && activeComment.id === comment.id && activeComment.type === "replying";
	const fiveMinutes = 300000;
	const timePassed = new Date() - new Date(comment.createdAt) > fiveMinutes;
	const canDelete = currentUserId === comment.userId;
	const canReply = Boolean(currentUserId);
	const canEdit = currentUserId === comment.userId && !timePassed;
	const replyId = parentId ? parentId : comment.id;
	const createdAt = new Date(comment.createdAt).toLocaleDateString();

	return (
		<div key={comment.id} className="comment">
			<div className="comment-image-container">
				<img src={profileImgUrl} style={{ width: "30px" }} />
			</div>
			<div className="comment-right-part">
				<div className="comment-content">
					<div className="comment-author" style={{ color: "#fa9f42" }}>
						{comment.username}
					</div>
					<div>{createdAt}</div>
				</div>
				{!isEditing && <div className="comment-text">{comment.body}</div>}
				{isEditing && (
					<CommentForm
						submitLabel="Update"
						hasCancelButton
						initialText={comment.body}
						handleSubmit={text => updateComment(text, comment.id)}
						handleCancel={() => {
							setActiveComment(null);
						}}
					/>
				)}
				<div className="comment-actions">
					{canReply && (
						<div
							className="comment-action"
							onClick={() => setActiveComment({ id: comment.id, type: "replying" })}
							style={{ color: "#fa9f42" }}>
							Responder
						</div>
					)}
					{canEdit && (
						<div
							className="comment-action"
							onClick={() => setActiveComment({ id: comment.id, type: "editing" })}
							style={{ color: "#fa9f42" }}>
							Editar
						</div>
					)}
					{canDelete && (
						<div
							className="comment-action"
							onClick={() => deleteComment(comment.id)}
							style={{ color: "#fa9f42" }}>
							Eliminar
						</div>
					)}
				</div>
				{isReplying && <CommentForm submitLabel="Responder" handleSubmit={text => addComment(text, replyId)} />}
				{replies.length > 0 && (
					<div className="replies">
						{replies.map(reply => (
							<Comment
								comment={reply}
								key={reply.id}
								setActiveComment={setActiveComment}
								activeComment={activeComment}
								updateComment={updateComment}
								deleteComment={deleteComment}
								addComment={addComment}
								parentId={comment.id}
								replies={[]}
								currentUserId={currentUserId}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Comment;

Comment.propTypes = {
	comment: PropTypes.string,
	replies: PropTypes.string,
	setActiveComment: PropTypes.string,
	updateComment: PropTypes.string,
	deleteComment: PropTypes.string,
	addComment: PropTypes.string,
	parentId: PropTypes.string,
	currentUserId: PropTypes.string,
	activeComment: PropTypes.string
};
