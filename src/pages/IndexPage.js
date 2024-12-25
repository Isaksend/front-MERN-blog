import Post from "../components/Post";
import {useEffect, useState} from "react";

export default function IndexPage(){
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        let ignore = false;
        fetch("http://localhost:4000/post").then(res =>{
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
        <div className="AllPosts">
            {posts.length > 0 && posts.map((post) => (
                <Post {...post} />
            ))}
        </div>
    );
}