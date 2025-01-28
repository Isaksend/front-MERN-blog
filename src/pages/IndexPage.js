import Post from "../components/Post";
import {useEffect, useState} from "react";
import CurrencyBlock from "../components/CurrencyBlock";

export default function IndexPage(){
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        let ignore = false;
        fetch("http://localhost:4000/api/posts").then(res =>{
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
            <div className="CurrencyBlock">
               <CurrencyBlock />
            </div>
        </div>

    );
}