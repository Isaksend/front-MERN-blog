import {useState} from "react";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [verificationSent, setVerificationSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    // Функция для отправки кода подтверждения
    async function sendVerificationCode() {
        const response = await fetch('http://localhost:4000/api/users/send-verification-code', {
            method: 'POST',
            body: JSON.stringify({email}),
            headers: {'Content-Type': 'application/json'},
        });
        const data = await response.json();
        if (response.status === 200) {
            setVerificationSent(true);
            alert(data.message);
        } else {
            alert("Error sending verification code");
        }
    }

    // Функция для проверки кода
    async function verifyCode() {
        const response = await fetch('http://localhost:4000/api/users/verify-code', {
            method: 'POST',
            body: JSON.stringify({email, code}),
            headers: {'Content-Type': 'application/json'},
        });
        const data = await response.json();
        if (response.status === 200) {
            setIsVerified(true);
            alert(data.message);
        } else {
            alert("Invalid or expired code");
        }
    }

    // Функция для регистрации
    async function register(ev) {
        ev.preventDefault();
        if (!isVerified) {
            return alert("Please verify your email before registering");
        }
        const response = await fetch('http://localhost:4000/api/users/register', {
            method: 'POST',
            body: JSON.stringify({username, password, email}),
            headers: {'Content-Type': 'application/json'},
        });
        if (response.status === 200) {
            alert("Registration successfully");
        } else {
            alert("User already exists or another issue");
        }
    }

    return (
        <div>
            <form className="register" onSubmit={register}>
                <h1>Register</h1>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {verificationSent ? (
                    <>
                        <input
                            type="text"
                            placeholder="Enter verification code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <button type="button" onClick={verifyCode}>
                            Verify Code
                        </button>
                    </>
                ) : (
                    <button type="button" onClick={sendVerificationCode}>
                        Send Verification Code
                    </button>
                )}
                <button type="submit" disabled={!isVerified}>
                    Register
                </button>
            </form>
        </div>
    );
}
