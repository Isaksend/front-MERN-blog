import {useContext, useState} from "react";
import {createCookie, Navigate} from "react-router-dom";
import {UserContext} from "../UserContext";

export default function LoginPage(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [redirect, setRedirect] = useState(false);
    const { setUserInfo } = useContext(UserContext);

    const validateForm = () => {
        if (!username.trim()) {
            setErrorMessage("Username is required");
            return false;
        }
        if (password.length < 5) {
            setErrorMessage("Password must be at least 5 characters long");
            return false;
        }
        setErrorMessage("");
        return true;
    };
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value ;
    }

    async function login(ev){
        ev.preventDefault();
        if (!validateForm()) return;
        try {
            const response = await fetch("https://back-web-production.up.railway.app/api/users/login", {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // 🔥 ОБЯЗАТЕЛЬНО! 🔥
            });

            if (response.ok) {
                const data = await response.json();
                setUserInfo(data);

                // 🔥 Явно сохраняем токен в куки, если сервер не делает это сам
                if (data.token) {
                    setCookie('token', data.token, 7); // Срок хранения 7 дней
                }

                setRedirect(true);
            } else {
                setErrorMessage("Invalid username or password");
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage("Something went wrong. Please try again later.");
        }
    }
    if (redirect){
        return <Navigate to={'/'}/>
    }

    return(
        <div className="login-container">
            <form className="login-form" onSubmit={login}>
                <h1>Login</h1>
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <input type="text"
                       placeholder="Username"
                       value={username}
                       onChange={(ev) => setUsername(ev.target.value)}
                       className={errorMessage && !username.trim() ? "input-error" : ""}/>
                <input type="password"
                       placeholder="Password"
                       value={password}
                       onChange={(ev) => setPassword(ev.target.value)}
                       className={errorMessage && password.length < 6 ? "input-error" : ""}/>
                <button type="submit" disabled={!username.trim() || password.length < 5}
                >Login
                </button>
            </form>
            <style>{`
                .login-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                }

                .login-form {
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    width: 350px;
                }

                h1 {
                    margin-bottom: 20px;
                    color: #333;
                }

                .error-message {
                    color: red;
                    font-size: 14px;
                    margin-bottom: 10px;
                }

                input {
                    width: 100%;
                    padding: 10px;
                    margin: 10px 0;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    transition: 0.3s;
                }

                input:focus {
                    border-color: #667eea;
                    outline: none;
                }

                .input-error {
                    border-color: red;
                }

                button {
                    width: 100%;
                    padding: 10px;
                    border: none;
                    border-radius: 5px;
                    background: #667eea;
                    color: white;
                    cursor: pointer;
                    font-size: 16px;
                    transition: 0.3s;
                }

                button:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }

                button:hover:not(:disabled) {
                    background: #764ba2;
                }
            `}</style>
        </div>
    );
}