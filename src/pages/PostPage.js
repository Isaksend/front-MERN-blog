import {useContext, useEffect, useState} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import {formatISO9075} from "date-fns";
import {UserContext} from "../UserContext";
import Comments from '../components/Comments';

export default function PostPage(){
    const [postInfo,setPostInfo]=useState(null);
    const {userInfo} = useContext(UserContext)
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(()=>{
        fetch(`https://back-web-production.up.railway.app/api/posts/${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch post: ${res.status}`);
                }
                return res.json();
            })
            .then(postInfo => {
                setPostInfo(postInfo);
            })
            .catch(err => {
                console.error('Error fetching post:', err);
                alert('Failed to load the post. Please try again later.');
            });
    }, [id]);
    const deletePost = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this post?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`https://back-web-production.up.railway.app/api/posts/${id}`, {
                method: 'DELETE',
                credentials: 'include', // For cookie
            });

            if (response.ok) {
                alert('Post deleted successfully');
                navigate('/');
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to delete the post');
            }
        } catch (err) {
            console.error('Error deleting post:', err);
            alert('Something went wrong. Please try again later.');
        }
    };
    if (!postInfo) return <p>Loading post...</p>;

    const isAuthor = userInfo && userInfo.id === postInfo.author?._id;


    return(
        <div className="post-page">
            <h1>{postInfo.title}</h1>
            <div className="info-article">
                <Link to={`/profile/${postInfo.author?._id}`} className="author">
                    by @{postInfo.author?.username || "Unknown"}
                </Link>
                <div className="author">
                </div>
                <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
            </div>
            {isAuthor && (
                <div className="edit-block">
                    <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
                        Edit Post
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                        </svg>
                    </Link>
                    <div className="delete-block">
                        <button className="delete-btn" onClick={deletePost}>
                            Delete Post
                        </button>
                    </div>
                </div>
            )}
            <div className="image">
                <img src={`https://back-web-production.up.railway.app/${postInfo.cover}`}/>
            </div>
            <div className="content" dangerouslySetInnerHTML={{__html: postInfo.content}}/>
            <Comments postId={id} />
        </div>
    )
}