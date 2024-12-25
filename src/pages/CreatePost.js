import 'react-quill/dist/quill.snow.css';
import {useState} from "react";
import {Navigate} from "react-router-dom";
import Editor from "../components/Editor";


export default function CreatePost(){
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState("");
    const [redirect, setRedirect] = useState(false);
    async function createNewPost(ev){
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);
        ev.preventDefault();
        const response = await fetch('http://localhost:4000/post', {
            method: 'POST',
            body: data,
            credentials: "include"
        });
        if (response.ok){
            setRedirect(true)
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