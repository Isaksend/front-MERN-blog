import {format} from "date-fns";
import {Link} from "react-router-dom";
import { UserContext } from '../UserContext';
import {useContext, useEffect, useState} from "react";

export default function Post({_id, title, summary, cover, content, createdAt, updatedAt, author}) {
    const { userInfo } = useContext(UserContext);
    const [post, setPost] = useState(null);
    const [likes, setLikes] = useState([]);

    useEffect(() => {
        if (!_id || title) {
            setPost({ _id, title, summary, cover, createdAt, author });
            return;
        }

        fetch(`https://back-web-production.up.railway.app/api/posts/${_id}`)
            .then((response) => response.json())
            .then((data) => {
                setPost(data.post);
                setLikes(data.likes || []); // Устанавливаем лайки из ответа
            })
            .catch((error) => console.error("Error fetching post:", error));

    }, [_id, title]);


    const toggleLikePost = async () => {
        if (!userInfo?.id) {
            alert('You must be logged in to like this post.');
            return;
        }

        try {
            const response = await fetch(`https://back-web-production.up.railway.app/api/likes/posts/${_id}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userInfo?.id }),
            });

            if (response.ok) {
                const data = await response.json();
                const alreadyLiked = likes.includes(userInfo?.id);

                setLikes(
                    alreadyLiked
                        ? likes.filter((id) => id !== userInfo?.id)
                        : [...likes, userInfo?.id]
                );
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to toggle like');
            }
        } catch (error) {
            console.error('Error toggling like on post:', error);
        }
    };

    if (!post) {
        return <p>Loading...</p>;
    }
    return (
        <div className="post">
            <Link to={`/posts/${_id}`}>
                <img src={'http://localhost:4000/' + cover} alt={cover}/>
            </Link>
            <div className="texts">
                <Link to={`/posts/${_id}`}>
                    <h3>{title}</h3>
                </Link>
                <p className="info">
                    <Link to={`/profile/${author?._id}`} className="author">
                        {author?.username || 'Unknown Author'}
                    </Link>
                    <time>{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time>
                </p>
                <p className="summary">
                    {summary}
                </p>
            </div>
        </div>
    );
}