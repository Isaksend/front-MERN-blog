import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import Editor from "../components/Editor";


export default function EditPost() {
    const {id} = useParams();
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState("");
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        fetch(`https://back-web-production.up.railway.app/api/posts/${id}`)
            .then(res =>{
                res.json().then(postInfo => {
                    setTitle(postInfo.title);
                    setContent(postInfo.content);
                    setSummary(postInfo.summary);
                })
            })
    }, []);

    async function updatePost(ev){
        ev.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if (files?.[0]){
            data.set('file', files?.[0]);
        }
        const response = await fetch(`https://back-web-production.up.railway.app/api/posts/${id}`, {
            method: 'PUT',
            body: data,
            credentials: 'include',
        })
        if (response.ok){
            setRedirect(true);
        }
    }

    if (redirect){
        return <Navigate to={`/posts/${id}`} />;
    }
    return(
        <div>
            <form onSubmit={updatePost}>
                <input type="text"
                       name="title"
                       placeholder={'Title'}
                       value={title}
                       onChange={(ev) => setTitle(ev.target.value)}
                       required/>
                <input type="text"
                       name="summary"
                       placeholder={'Summary'}
                       value={summary}
                       onChange={(ev) => setSummary(ev.target.value)}
                       required/>
                <input type="file"
                       onChange={(ev) => setFiles(ev.target.files)}
                />
                <Editor
                    onChange={ setContent} value={content}
                />
                <button style={{marginTop:"10px"}}>
                    Update post
                </button>
            </form>
        </div>
    );
}