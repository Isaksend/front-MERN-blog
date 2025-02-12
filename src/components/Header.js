import {Link} from "react-router-dom";
import React, {useContext, useEffect } from "react";
import {UserContext} from "../UserContext";
import {useNavigate} from "react-router-dom";

export default function Header(){
    const { setUserInfo, userInfo } = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {
        fetch('http://localhost:4000/api/users/profile', {
            credentials: 'include',
        })
            .then(response => {
            if (response.ok) {
                response.json().then(userInfo => {
                    setUserInfo(userInfo);
                });
            } else {
                setUserInfo(null);
            }
        }).catch(error => {
            console.error('Ошибка загрузки профиля:', error);
        });
    }, [setUserInfo]);

    function logout(){
        fetch('http://localhost:4000/api/users/logout', {
            method: 'POST',
            credentials: 'include',

        }).then((response) => {
            if (response.ok) {
                setUserInfo(null);
                navigate('/');
            } else {
                console.error('Ошибка при выходе из аккаунта');
                alert('Не удалось выйти из аккаунта. Попробуйте снова.');
            }
        }).catch(error => {
            console.error('Ошибка сети при выходе:', error);
            alert('Ошибка сети. Пожалуйста, проверьте соединение и попробуйте снова.');
        });
    }
    const username = userInfo?.username;
    return (
        <header className="App-header">
            <Link to="/" className="logo">Isaksend Blog</Link>
            <nav className="App-nav">
                {username && (
                    <>
                        <span>Hello {username}!</span>
                        <Link to={`/profile/${userInfo.id}`} className="profile-button">
                            Profile
                        </Link>
                        <Link to="/create">Create post</Link>
                        <button onClick={logout}
                                style={{background: 'none', border: 'none', width: "100px", color: "black", cursor: 'pointer'}}>
                            Logout
                        </button>
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