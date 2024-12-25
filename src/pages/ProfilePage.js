// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
//
// export default function ProfilePage() {
//     const { id } = useParams();
//     const [profile, setProfile] = useState(null);
//     const [loading, setLoading] = useState(true);
//
//     useEffect(() => {
//         // Запрашиваем данные профиля пользователя
//         fetch(`http://localhost:4000/profile/${id}`, {
//             credentials: "include",
//         })
//             .then((res) => res.json())
//             .then((data) => {
//                 setProfile(data);
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 console.error("Failed to fetch profile:", err);
//                 setLoading(false);
//             });
//     }, [id]);
//
//     if (loading) return <div>Loading...</div>;
//     if (!profile) return <div>User not found</div>;
//
//     return (
//         <div className="profile-page">
//             <h1>Profile of @{profile.user.username}</h1>
//             <p>Joined: {new Date(profile.user.createdAt).toLocaleDateString()}</p>
//
//             <h2>Publications</h2>
//             {profile.posts.length === 0 ? (
//                 <p>No posts yet.</p>
//             ) : (
//                 <ul className="posts-list">
//                     {profile.posts.map((post) => (
//                         <li key={post._id} className={`post-item ${post.deleted ? 'deleted' : ''}`}>
//                             <Link to={`/post/${post._id}`}>
//                                 <h3>{post.title}</h3>
//                                 <p>{post.summary}</p>
//                                 {post.deleted && <span className="deleted-tag">Deleted</span>}
//                             </Link>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// }
