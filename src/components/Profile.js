import React, {useState, useEffect, useContext} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostCard from "./PostCard";
import { UserContext } from '../UserContext';

export default function Profile() {
    const { id } = useParams();
    const { userInfo } = useContext(UserContext);
    const [user, setUser] = useState(null);
    const [activeForm, setActiveForm] = useState(null);
    const [posts, setPosts] = useState([]);
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

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = getToken();
            if (!token) return;

            try {
                setUser(null);
                setPosts([]);
                const response = await fetch(`https://back-web-production.up.railway.app/api/users/profile/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    setEmail(data.email);
                    setUsername(data.username);
                    setCity(data.city || '');
                    console.log("User profile data:", data);
                    if (Array.isArray(data.posts)) {
                        console.log("Raw posts data:", data.posts);
                        const postIds = data.posts.map(post => post._id).filter(id => id); // Гарантируем, что там только ID
                        fetchUserPosts(postIds);
                    }
                } else {
                    console.error('Failed to fetch user profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchUserProfile();
    }, [id]);


    const fetchUserPosts = async (postIds) => {
        try {
            console.log("User post raw IDs:", postIds);

            const validPostIds = postIds
                .filter(postId => typeof postId === "string") // Убираем объекты
                .map(id => id.trim()); // Убираем пробелы

            console.log("Final processed post IDs:", validPostIds);

            if (validPostIds.length === 0) {
                console.warn("Ошибка: Нет корректных postId, пропускаем запросы!");
                return;
            }

            const postRequests = validPostIds.map(postId =>
                fetch(`https://back-web-production.up.railway.app/api/posts/${postId}`).then(res => res.json())
            );

            const postsData = await Promise.all(postRequests);
            console.log("Fetched posts:", postsData);

            setPosts(postsData);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const isCurrentUser = userInfo?.id === String(user?._id);

    const toggleForm = (form) => {
        setActiveForm(activeForm === form ? null : form);
    };

    const handleSendVerificationCode = async () => {
        try {
            const response = await fetch('https://back-web-production.up.railway.app/api/users/send-verification-code', {
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
            const response = await fetch('https://back-web-production.up.railway.app/api/users/update-profile', {
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
            const response = await fetch('https://back-web-production.up.railway.app/api/users/change-password', {
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

    if (!user) {
        return <div>Loading...</div>;
    }
    return (
        <div className="profile">
            <div className="profile-container">
                <div className="profile-info">
                    <h2>{user.username}</h2>
                    <p><strong>Email:</strong> {user.email}</p>
                    {user.city && <p><strong>City:</strong> {user.city}</p>}
                    <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>

                {isCurrentUser && (
                    <div className="profile-actions">
                        <button onClick={() => toggleForm('edit')} className="profile-btn">Edit Profile</button>
                        <button onClick={() => toggleForm('password')} className="profile-btn">Change Password</button>
                    </div>
                )}
                {activeForm === 'edit' && (
                    <form className="profile-form" onSubmit={handleUpdateProfile}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            defaultValue={user.email}
                        />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            defaultValue={user.username}
                        />
                        <input
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            defaultValue={user.city || ''}
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
                        <button className="profile-btn" type="submit">Update Profile</button>
                    </form>
                )}
                {activeForm === 'password' && (
                    <form className="profile-form" onSubmit={handleChangePassword}>
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
                        <button type="button" className="profile-btn" onClick={handleSendVerificationCode}>
                            Get Verification Code
                        </button>
                        <button type="submit" className="profile-btn">Change Password</button>
                    </form>
                )}


                {message && <p>{message}</p>}
            </div>

            <div className="posts-section">
                <h3>Posts: </h3>
                <div className="posts-grid">
                    {posts.length > 0 ? posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    )) : (
                        <p>No posts yet</p>
                    )}
                </div>
            </div>

            <style>{`
                .profile-container {
                    max-width: 450px;
                    margin: auto;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                    background: #fff;
                    text-align: center;
                }

                .profile-info {
                    margin-bottom: 20px;
                }

                .profile-actions {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    gap: 20px;
                }

                .profile-btn {
                    padding: 8px 12px;
                    border: none;
                    border-radius: 5px;
                    background-color: #007bff;
                    color: white;
                    cursor: pointer;
                    transition: background 0.3s;
                }

                .profile-btn:hover {
                    background-color: #0056b3;
                }

                .profile-form {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: 10px;
                }

                input {
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }

                .posts-section {
                    margin-top: 20px;
                    text-align: left;
                    
                }
                .posts-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                }
            `}</style>
        </div>
    );
}
