import { useState, useEffect, useContext } from 'react';
import {UserContext} from "../UserContext";

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
                    setComments(data);
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
        const response = await fetch(`http://localhost:4000/api/comments/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify({
                content,
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
            setComments([newComment, ...comments]);
            setContent('');
            setParentId(null);
        } else {
            console.error('Failed to submit comment');
        }
    };

    return (
        <div className="comments">
            {userInfo?.id ? (
                <form onSubmit={submitComment}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write a comment..."
                        required
                    />
                    <button type="submit">Submit</button>
                </form>
            ) : (
                <p>You must be logged in to write a comment.</p>
            )}
            <ul>
                {comments.map((comment) => (
                    <li key={comment._id}>
                        <p>
                            <strong>{comment.userId}</strong> - {new Date(comment.createdAt).toLocaleString()}
                        </p>
                        <p>{comment.content}</p>
                        <button onClick={() => setParentId(comment._id)}>Reply</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
