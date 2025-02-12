import React, { useState } from 'react';

export default function Profile() {
    const [showEditForm, setShowEditForm] = useState(false);
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [city, setCity] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const getToken = () => {
        return document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];
    };


    const handleSendVerificationCode = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/users/send-verification-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (response.ok) {
                setMessage('Verification code sent to your email');
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Failed to send verification code');
            }
        } catch (error) {
            console.error('Error sending verification code:', error);
            setMessage('Error sending verification code');
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const token = getToken();

        if (!token) {
            alert('No token found. Please log in again.');
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/api/users/update-profile', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ email, username, city, code }),
            });
            if (response.ok) {
                setMessage('Profile updated successfully');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Error updating profile');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/api/users/change-password', {
                method: 'PUT',
                credentials: 'include', // Включение отправки куки
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, newPassword, code }),
            });

            if (response.ok) {
                alert('Password changed successfully');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    return (
        <div className="profile">
            <button onClick={() => setShowEditForm(!showEditForm)}>Edit Profile</button>
            <button onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}>Change Password</button>

            {showEditForm && (
                <form onSubmit={handleUpdateProfile}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Verification Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                    <button type="button" onClick={handleSendVerificationCode}>
                        Get Verification Code
                    </button>
                    <button type="submit">Update Profile</button>
                </form>
            )}

            {showChangePasswordForm && (
                <form onSubmit={handleChangePassword}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Verification Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                    <button type="button" onClick={handleSendVerificationCode}>
                        Get Verification Code
                    </button>
                    <button type="submit">Change Password</button>
                </form>
            )}

            {message && <p>{message}</p>}
        </div>
    );
}
