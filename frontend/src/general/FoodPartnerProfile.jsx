import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './foodPartnerProfile.css';
import { useParams } from 'react-router-dom'

const FoodPartnerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current partner profile and videos
    const fetchProfile = async () => {
      try {
        
        // You may need to adjust the endpoint and how you get the partner ID (e.g. from auth context or cookie)
        const res = await axios.get(`http://localhost:3000/api/food-partner/${id}`, { withCredentials: true });
        // Expected response: { name, address, avatar, totalMeals, customerServed, videos: [{ id, label, ... }] }
        
        setProfile(res.data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div className="profile-container">Loading...</div>;
  if (error) return <div className="profile-container">{error}</div>;
  if (!profile) return null;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.avatar ? (
            <img src={profile.avatar} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
          ) : (
            <img src="https://media.istockphoto.com/id/476085198/photo/businessman-silhouette-as-avatar-or-default-profile-picture.webp?a=1&b=1&s=612x612&w=0&k=20&c=2BRV7hQGz5K3wBj47U8VdlFUB44iDiUshJ4IZw5zmLk=" style={{ width: '100%', height: '100%', borderRadius: '50%' }}/>
          )}
        </div>
        <div className="profile-info">
          <div className="profile-name">{profile.name}</div>
          <div className="profile-address">{profile.address}</div>
        </div>
      </div>
      <div className="profile-stats">
        <div className="profile-stat">
          <div className="profile-stat-label">total meals</div>
          <div className="profile-stat-value">{profile.totalMeals || 0}</div>
        </div>
        <div className="profile-stat">
          <div className="profile-stat-label">customer serve</div>
          <div className="profile-stat-value">{profile.customerServed || 0}</div>
        </div>
      </div>
      <hr className="profile-divider" />
      <div className="profile-videos-grid">
        {profile.videos && profile.videos.length > 0 ? (
          profile.videos.map((video) => (
      
              <video onClick={()=> navigate()} className="profile-video-thumb" key={video.id} src={video.label || 'video'} muted type="video/mp4" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center'}}>
                </video>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888' }}>No videos found</div>
        )}
      </div>
    </div>
  );
};

export default FoodPartnerProfile;