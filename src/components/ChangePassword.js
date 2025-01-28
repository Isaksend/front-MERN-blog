import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = ({ userId }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleChangePassword = async () => {
        try {
            const response = await axios.put(`/api/users/update-password/${userId}`, { oldPassword, newPassword });
            setMessage('Password updated successfully');
        } catch (error) {
            setMessage('Failed to update password');
        }
    };

    return (
        <div>
            <h2>Change Password</h2>
            <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleChangePassword}>Change Password</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ChangePassword;
