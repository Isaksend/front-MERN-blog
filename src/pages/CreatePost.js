import 'react-quill/dist/quill.snow.css';
import {useState} from "react";
import {Navigate} from "react-router-dom";
import Editor from "../components/Editor";
import { useEffect } from "react";

export default function CreatePost(){
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(true);
    useEffect(() => {
        fetch('https://back-web-production.up.railway.app/api/users/profile', {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                if (!data || data.error) {
                    alert('Session expired. Please log in again.');
                    setIsAuthorized(false);
                }
            });
    }, []);

    if (!isAuthorized) {
        return <Navigate to="/login" />;
    }

    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);

    async function createNewPost(ev){
        ev.preventDefault();

        if (!files || !files[0]) {
            alert('Please select a file');
            return;
        }

        try {
            const response = await fetch("https://back-web-production.up.railway.app/api/posts/", {
                method: 'POST',
                body: data,
                credentials: "include",
            });

            if (response.ok) {
                setRedirect(true);
            } else {
                const error = await response.json();
                console.error('Error creating post:', error);
                alert(error.error || 'Failed to create post');
            }
            if (response.ok){
                setRedirect(true)
            }
        } catch (err) {
            console.error('Network error:', err);
            alert('Network error. Please try again later.');
        }
    }

    if (redirect){
        return <Navigate to={'/'}/>
    }
    return(
        <div>
            <form onSubmit={createNewPost}>
                <input type="text"
                       name="title"
                       placeholder={'Title'}
                       value={title}
                       onChange={ev => setTitle(ev.target.value)}
                       required/>
                <input type="text"
                       name="summary"
                       placeholder={'Summary'}
                       value={summary}
                       onChange={ev => setSummary(ev.target.value)}
                       required/>
                <input type="file"
                       onChange={ev => setFiles(ev.target.files)}
                />
                <Editor
                    value={content}
                    onChange={setContent}
                />
                <button style={{marginTop:"10px"}}>
                    Create post
                </button>
            </form>
        </div>
    )
}