import {useState} from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [verificationSent, setVerificationSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [attemptsLeft, setAttemptsLeft] = useState(3);
    const navigate = useNavigate();
    // Функция для валидации
    function validateForm() {
        let newErrors = {};

        if (!username.trim()) {
            newErrors.username = "Username is required";
        } else if (username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Invalid email format";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }


    // Функция для отправки кода подтверждения
    async function sendVerificationCode() {
        if (!email.trim()) {
            setErrors({ email: "Enter your email to get a code" });
            return;
        }
        setLoading(true);

        try {
            const response = await fetch('https://back-web-production.up.railway.app/api/users/send-verification-code', {
                method: 'POST',
                body: JSON.stringify({email}),
                headers: {'Content-Type': 'application/json'},
            });
            const data = await response.json();
            if (response.status === 200) {
                setVerificationSent(true);
                setAttemptsLeft(3);
                alert(data.message);
            } else {
                alert("Error sending verification code");
            }
        } catch (error){
            alert("Network error, try again");
        } finally {
            setLoading(false);
        }

    }

    // Функция для проверки кода
    async function verifyCode() {

        if (!/^\d{6}$/.test(code)) {
            setErrors({ code: "Verification code must be 6 digits" });
            return;
        }

        if (attemptsLeft <= 0) {
            alert("Too many failed attempts. Request a new code.");
            return;
        }

        if (!code.trim()) {
            setErrors({ code: "Enter the verification code" });
            return;
        }

        setLoading(true);

        try{
            const response = await fetch('https://back-web-production.up.railway.app/api/users/verify-code', {
                method: 'POST',
                body: JSON.stringify({email, code}),
                headers: {'Content-Type': 'application/json'},
            });
            const data = await response.json();
            if (response.status === 200) {
                setIsVerified(true);
                alert("Email verified successfully!");
            } else {
                setAttemptsLeft(attemptsLeft - 1);
                alert(`Invalid or expired code. Attempts left: ${attemptsLeft - 1}`);
            }
        } catch (error) {
            alert("Network error, try again");
        } finally {
            setLoading(false);
        }

    }

    // Функция для регистрации
    async function register(ev) {
        ev.preventDefault();
        if (!validateForm()) return;
        if (!isVerified) {
            return alert("Please verify your email before registering");
        }
        setLoading(true);
        try{
            const response = await fetch('https://back-web-production.up.railway.app/api/users/register', {
                method: 'POST',
                body: JSON.stringify({username, password, email}),
                headers: {'Content-Type': 'application/json'},
            });
            if (response.status === 200) {
                alert("Registration successfully");
                navigate('/login');
            } else {
                alert("User already exists or another issue");
            }
        } catch (error){
            alert("Network error, try again");
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="register-container">
            <form className="register" onSubmit={register}>
                <h1>Sign Up</h1>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={errors.username ? "error-input" : ""}
                />
                {errors.username && <p className="error-message">{errors.username}</p>}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? "error-input" : ""}
                />
                {errors.password && <p className="error-message">{errors.password}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? "error-input" : ""}
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
                {verificationSent ? (
                    <>
                        <input
                            type="text"
                            placeholder="Enter verification code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className={errors.code ? "error-input" : ""}
                        />
                        {errors.code && <p className="error-message">{errors.code}</p>}

                        <button type="button" onClick={verifyCode} disabled={loading}>
                            {loading ? "Verifying..." : "Verify Code"}
                        </button>
                    </>
                ) : (
                    <button type="button" onClick={sendVerificationCode} disabled={loading}>
                        {loading ? "Sending..." : "Send Verification Code"}
                    </button>
                )}
                <button type="submit" disabled={!isVerified || loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
            <style>{`
                .register-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                }
                .register {
                    width: 100%;
                    max-width: 400px;
                    padding: 20px;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                h1 {
                    margin-bottom: 20px;
                    color: #333;
                }
                input {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    transition: 0.3s;
                }
                input:focus {
                    border-color: #667eea;
                    outline: none;
                }
                .error-input {
                    border-color: red !important;
                }
                .error-message {
                    color: red;
                    font-size: 12px;
                    margin-bottom: 10px;
                    text-align: left;
                }
                button {
                    width: 100%;
                    padding: 10px;
                    border: none;
                    border-radius: 5px;
                    background: #667eea;
                    color: white;
                    cursor: pointer;
                    transition: 0.3s;
                    margin-top: 15px;
                }
                button:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
                button:hover:not(:disabled) {
                    background: #5a67d8;
                }
            `}</style>
        </div>
    );
}
