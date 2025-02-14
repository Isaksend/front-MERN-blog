import {Link} from "react-router-dom";
import React, {useContext, useEffect } from "react";
import {UserContext} from "../UserContext";
import {useNavigate} from "react-router-dom";

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) return value;
    }
    return null;
}

export default function Header(){
    const { setUserInfo, userInfo } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getCookie("token");

        if (!token) {
            console.warn("Токен отсутствует, пользователь не авторизован.");
            setUserInfo(null);
            return;
        }

        fetch("https://back-web-production.up.railway.app/api/users/profile", {
            method: "GET",
            credentials: "include",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Отправляем токен
            }
        })
            .then(response => {
                console.log("Ответ сервера:", response);
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Не удалось загрузить профиль");
                }
            })
            .then(userInfo => {
                console.log("Данные пользователя:", userInfo);
                setUserInfo(userInfo);
            })
            .catch(error => {
                console.error("Ошибка загрузки профиля:", error);
                setUserInfo(null);
            });
    }, [setUserInfo]);

    function logout(){
        fetch('https://back-web-production.up.railway.app/api/users/logout', {
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