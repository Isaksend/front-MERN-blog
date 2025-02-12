import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function EditProfile( ) {
    const { id } = useParams();
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch(`http://localhost:4000/api/users/${id}`)
            .then(response => response.json())
            .then(data => {
                setEmail(data.email || '');
                setCity(data.city || '');
            })
            .catch(err => console.error('Ошибка загрузки данных пользователя:', err));
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`http://localhost:4000/api/users/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, city }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка обновления данных');
                }
                return response.json();
            })
            .then(data => {
                setMessage('Данные успешно обновлены!');
                console.log('Обновлённые данные:', data);
            })
            .catch(err => {
                setMessage('Ошибка обновления данных');
                console.error(err);
            });
    };

    return (
        <div className="edit-profile">
            <h1>Редактирование профиля</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Город:</label>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>
                <button type="submit">Обновить</button>
            </form>
        </div>
    );
}

export default EditProfile;
