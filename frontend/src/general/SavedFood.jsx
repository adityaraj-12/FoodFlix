import React, { useEffect, useState } from 'react';
import ReelActions from './ReelActions';
import { useNavigate } from 'react-router-dom';
import './SavedFood.css';
import './foodPartnerProfile.css';
import axios from 'axios';

const SavedFood = () => {
  const [savedReels, setSavedReels] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const handleProfileClick = (e) => {
    console.log(e);
  }
  useEffect(() => {
    async function fetchSaved() {
      try {
        const res = await axios.get('http://localhost:3000/api/food/save', { withCredentials: true });
        // Expecting res.data.savedItems to be an array of food items with populated foodPartner
        const items = Array.isArray(res.data.savedItems) ? res.data.savedItems : [res.data.savedItems];
        const data = items
          .filter(item => item && item.video && item.foodPartner && item.description)
          .map(item => ({
            id: item._id,
            videoUrl: item.video,
            userName: item.foodPartner.name,
            description: item.description,
            storeUrl: item.foodPartner._id,
            likes: item.likeCount || 0,
            saves: item.saveCount || 0,
            comments: item.commentCount || 0,
          }));
        setSavedReels(data);
      } catch (err) {
        setSavedReels([]);
      }
      setLoading(false);
    }
    fetchSaved();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3000/api/auth/user/logout', {}, { withCredentials: true });
      navigate('/user/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  return (
    <div className="saved-food-container">

      <div className="profile-header">
        <div className="profile-avatar">
          {"user" ? (
            <img src={"#"} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
          ) : (
            <img src="https://media.istockphoto.com/id/476085198/photo/businessman-silhouette-as-avatar-or-default-profile-picture.webp?a=1&b=1&s=612x612&w=0&k=20&c=2BRV7hQGz5K3wBj47U8VdlFUB44iDiUshJ4IZw5zmLk=" style={{ width: '100%', height: '100%', borderRadius: '50%' }}/>
          )}
        </div>
        <div className="profile-info">
          <div className="profile-name">{"user-name"}</div>
          <div className="profile-name log-btn" onClick={handleLogout}>Logout</div>
        </div>
      </div>

      <h2 className="saved-food-title">Saved Reels</h2>
      {loading ? (
        <div className="reels-loading">Loading...</div>
      ) : savedReels.length === 0 ? (
        <div className="reels-empty">No saved reels found.</div>
      ) : (
        <div className="saved-food-list">
          {savedReels.map(video => (
            <div className="saved-food-reel" key={video.id}>
              <video
                src={video.videoUrl}
                controls
                loop
                muted
                playsInline
              />
              <div className="saved-food-overlay">
                <div className="saved-food-user">@{video.userName}</div>
                <div className="saved-food-desc">{video.description}</div>
                <button
                  className="saved-food-store-btn"
                  onClick={() => navigate(`/food-partner/${video.storeUrl}`)}
                >
                  Visit Store
                </button>
              </div>
              <div className="saved-food-actions">
                <ReelActions likes={video.likes} saves={video.saves} comments={video.comments} foodId={video.id} />
              </div>
            </div>
          ))}
        </div>
      )}
      <ReelActions.BottomNav />
    </div>
  );
};

export default SavedFood;