import Post from "../components/Post";
import {useEffect, useState} from "react";

export default function IndexPage(){
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        let ignore = false;
        fetch("https://back-web-production.up.railway.app/api/posts").then(res =>{
            res.json().then(posts => {
                if (!ignore) {
                    setPosts(posts);
                }
            });
        });
        return () => {
            ignore = true;
        };
    }, []);
    return(
        <div className="AllContent">
            <div className="AllPosts">
                {posts.length > 0 && posts.map((post) => (
                    <Post key={post._id} {...post} />
                ))}
            </div>
        </div>

    );
}