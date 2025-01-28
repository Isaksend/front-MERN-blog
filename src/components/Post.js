import {format} from "date-fns";
import {Link} from "react-router-dom";

export default function Post({_id, title, summary, cover, content, createdAt, updatedAt, author}) {
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
                    <a href="#" className="author">{author.username}</a>
                    <time>{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time>
                </p>
                <p className="summary">
                    {summary}
                </p>
            </div>
        </div>
    );
}