import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
    const { id } = useParams(); // Получение ID из URL
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`https://back-web-production.up.railway.app/api/users/${id}`);
                setUser(response.data);
            } catch (err) {
                setError('Failed to fetch user profile');
            }
        };

        fetchUser();
    }, [id]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{user.username}</h1>
            <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
    );
};

export default UserProfile;
