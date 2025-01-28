// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
//
// const ProfilePage = ({ userInfo, profileId }) => {
//     const [profileInfo, setProfileInfo] = useState(null);
//
//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {
//                 const response = await axios.get(`/api/users/${profileId}`);
//                 setProfileInfo(response.data);
//             } catch (error) {
//                 console.error('Failed to load profile', error);
//                 setProfileInfo(null);
//             }
//         };
//
//         fetchProfile();
//     }, [profileId]);
//
//     if (!profileInfo) {
//         return <div>Loading...</div>;
//     }
//
//     const isOwner = userInfo.id === profileInfo.id;
//
//     return (
//         <div>
//             <h1>{profileInfo.username}'s Profile</h1>
//             {isOwner ? (
//                 <button onClick={() => console.log('Edit Profile')}>Edit Profile</button>
//             ) : (
//                 <p>You do not have access to edit this profile.</p>
//             )}
//         </div>
//     );
// };
//
// export default ProfilePage;
