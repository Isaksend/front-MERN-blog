import {Link} from "react-router-dom";
import {useContext, useEffect} from "react";
import {UserContext} from "../UserContext";

export default function Header(){
    const { setUserInfo, userInfo } = useContext(UserContext);
    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });
    }, []);

    function logout(){
        fetch('http://localhost:4000/logout', {
            method: 'POST',
            credentials: 'include',
        });
        setUserInfo(null);
    }
    const username = userInfo?.username;
    return (
        <header className="App-header">
            <Link to="/" className="logo">Isaksend Blog</Link>
            <nav className="App-nav">
                {username && (
                    <>
                        <span>Hello {username}!</span>
                        <Link to="/create">Create post</Link>
                        <a onClick={logout}>Logout</a>
                    </>
                )}
                {!username && (
                    <>
                        <Link to="/login" className="nav_item">Login</Link>
                        <Link to="/register" className="nav_item">Register</Link>
                    </>
                )
                }
            </nav>
        </header>
    );
}