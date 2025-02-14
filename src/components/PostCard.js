import React from 'react';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/posts/${post._id}`);
    };

    return (
        <div className="post-card" onClick={handleClick}>
            <img src={`https://back-web-production.up.railway.app/${post.cover}`} alt={post.title} className="post-image"/>
            <h4 className="post-title">{post.title}</h4>
            <p className="post-summary">{post.summary}</p>
            <style>{`
                .post-card {
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s, box-shadow 0.2s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    padding: 10px;
                    cursor: pointer;
                }

                .post-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
                }

                .post-image {
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                    border-radius: 8px;
                }

                .post-title {
                    margin-top: 10px;
                    font-size: 16px;
                    font-weight: bold;
                    color: #333;
                }

                .post-summary {
                    font-size: 12px;
                    color: #666;
                    margin: 3px 0;
                    text-overflow: ellipsis;
                }
            `}</style>
        </div>
    );
};

export default PostCard;
