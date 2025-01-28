import React, { useState } from 'react';
import axios from 'axios';

const EditProfile = ({ userId }) => {
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [message, setMessage] = useState('');

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`/api/users/update/${userId}`, { email, city });
            setMessage('Profile updated successfully');
        } catch (error) {
            setMessage('Failed to update profile');
        }
    };

    return (
        <div>
            <h2>Edit Profile</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <button onClick={handleUpdate}>Update Profile</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default EditProfile;
