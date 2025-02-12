import { useState, useEffect, useContext } from 'react';
import { UserContext } from "../UserContext";

export default function Comments({ postId }) {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [parentId, setParentId] = useState(null);
    const { userInfo } = useContext(UserContext);

    useEffect(() => {
        if (!postId) return;
        fetch(`http://localhost:4000/api/comments/posts/${postId}/comments`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setComments(data.map(comment => ({
                        ...comment,
                        likes: comment.likes || [],
                    })));
                } else {
                    setComments([]);
                }
            })
            .catch(err => console.error('Error fetching comments:', err));
    }, [postId]);

    const submitComment = async (ev) => {
        ev.preventDefault();

        if (!userInfo?.id) {
            alert('You must be logged in to write a comment.');
            return;
        }

        const url = parentId
            ? `http://localhost:4000/api/comments/comments/${parentId}/replies`
            : `http://localhost:4000/api/comments/posts/${postId}/comments`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    content: content.replace(`@${parentId?.username}`, ''),
                    parentCommentId: parentId,
                    userId: userInfo.id,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const newComment = await response.json();
                setComments([{
                    ...newComment,
                    username: userInfo.username,
                    likes: [],
                }, ...comments]);
                setContent('');
                setParentId(null);
            } else {
                console.error('Failed to submit comment');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const toggleLikeComment = async (commentId) => {
        if (!userInfo?.id) {
            alert('You must be logged in to like comments.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/api/likes/comments/${commentId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userInfo.id }),
            });

            if (response.ok) {
                const data = await response.json();
                const updatedComments = comments.map((comment) => {
                    if (comment._id === commentId) {
                        const alreadyLiked = comment.likes.includes(userInfo.id);
                        return {
                            ...comment,
                            likes: alreadyLiked
                                ? comment.likes.filter((id) => id !== userInfo.id)
                                : [...comment.likes, userInfo.id],
                        };
                    }
                    return comment;
                });
                setComments(updatedComments);
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to like comment');
            }
        } catch (error) {
            console.error('Error toggling like on comment:', error);
        }
    };

    const renderComments = (comments, level = 0) => {
        const sortedComments = [...comments].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        return sortedComments.map(comment => (
            comment && comment.userId ? (
                <li key={comment._id} className="comment-item" style={{ marginLeft: `${level * 20}px` }}>
                    <p>
                        <strong>{comment.userId.username || "Unknown User"}</strong> - {new Date(comment.createdAt).toLocaleString()}
                    </p>
                    <p>{comment.content}</p>
                    <div className="buttonsBlock">
                        <button className="like-button" onClick={() => toggleLikeComment(comment._id)}>
                            {Array.isArray(comment.likes) && comment.likes.includes(userInfo?.id) ? 'Unlike' : 'Like'} ({Array.isArray(comment.likes) ? comment.likes.length : 0})
                        </button>
                        <button
                            className="reply-button"
                            onClick={() => {
                                setParentId(comment._id);
                                setContent(`@${comment.userId.username} `);
                            }}
                        >
                            Reply
                        </button>
                    </div>
                    {comment.replies && comment.replies.length > 0 && (
                        <ul>{renderComments(comment.replies, level + 1)}</ul>
                    )}
                </li>
            ) : null
        ));
    };

    return (
        <div className="comments">
            {userInfo?.id ? (
                <form onSubmit={submitComment}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={parentId ? 'Write a reply...' : 'Write a comment...'}
                        required
                    />
                    <button type="submit">
                        {parentId ? 'Reply' : 'Submit'}
                    </button>
                </form>
            ) : (
                <p>You must be logged in to write a comment.</p>
            )}
            <ul>{renderComments(comments)}</ul>
        </div>
    );
}
