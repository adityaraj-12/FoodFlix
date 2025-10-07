import React, { useEffect } from 'react';
import axios from 'axios';
import './ReelActions.css';
import { FaHeart, FaRegBookmark, FaRegComment, FaHome, FaBookmark, FaUser } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';


// Functions to fetch counts from backend for a given foodId
export async function fetchLikeCount(foodId) {
  try {
    const res = await axios.get(`http://localhost:3000/api/food/${foodId}/likeCount`, { withCredentials: true });
    return res.data.likeCount || 0;
  } catch {
    return 0;
  }
}

export async function fetchSaveCount(foodId) {
  try {
    const res = await axios.get(`http://localhost:3000/api/food/${foodId}/saveCount`, { withCredentials: true });
    return res.data.saveCount || 0;
  } catch {
    return 0;
  }
}

export async function fetchCommentCount(foodId) {
  try {
    const res = await axios.get(`http://localhost:3000/api/food/${foodId}/commentCount`, { withCredentials: true });
    return res.data.commentCount || 0;
  } catch {
    return 0;
  }
}


// Functions to like, save, and comment on a reel
async function likeReel(e) {
  const { id } = useParams();
  console.log(id);
  try {
    const res = await axios.post('http://localhost:3000/api/food/like', { id }, { withCredentials: true });
    return res.data;
  } catch (err) {
    return { error: err?.response?.data?.message || 'Failed to like' };
  }
}


// export async function saveReel(foodId) {
//   try {
//     const res = await axios.post('http://localhost:3000/api/food/save', { foodId }, { withCredentials: true });
//     return res.data;
//   } catch (err) {
//     return { error: err?.response?.data?.message || 'Failed to save' };
//   }
// }

// export async function commentReel(foodId, text) {
//   try {
//     const res = await axios.post('http://localhost:3000/api/food/comment', { foodId, text }, { withCredentials: true });
//     return res.data;
//   } catch (err) {
//     return { error: err?.response?.data?.message || 'Failed to comment' };
//   }
// }

// Example usage: wire up like/save buttons
const ReelActions = ({ likes, saves, comments, foodId }) => {
  const [likeCount, setLikeCount] = React.useState(likes);
  const [saveCount, setSaveCount] = React.useState(saves);

  // ...existing code...
  // const handleLike = async () => {
  //   // const res = await likeReel(foodId);
  //   if (!res.error) setLikeCount(likeCount + 1); // Optimistic update
  // };
  // const handleSave = async () => {
  //   const res = await saveReel(foodId);
  //   if (!res.error) setSaveCount(saveCount + 1);
  // };

  const handleLike = async () => {
    try {
      console.log(foodId);
      const res = await axios.post('http://localhost:3000/api/food/like', { foodId }, { withCredentials: true });
      if (!res.error) setLikeCount(likeCount + 1) // Optimistic update
      return res.data;
    } catch (err) {
        setLikeCount(likeCount -1); // Revert if error
        return { error: err?.response?.data?.message || 'Failed to like' };
      }
  };

  const handleSave = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/food/save', { foodId }, { withCredentials: true });
      if (!res.error) setSaveCount(saveCount + 1);
      return res.data;
    } catch (err) {
          setSaveCount(saveCount -1); // Revert if error
        return { error: err?.response?.data?.message || 'Failed to save' };
      }
  };


  return (
    <div className="reel-actions">
      <button 
        className="reel-action-btn" title="Like" onClick={handleLike}>
        <FaHeart size={15} style={{marginBottom:2}} />
        <span className="reel-action-label">{likeCount}</span>
      </button>
      <button className="reel-action-btn" title="Save" onClick={handleSave}>
        <FaRegBookmark size={15} style={{marginBottom:2}} />
        <span className="reel-action-label">{saveCount}</span>
      </button>
      <button className="reel-action-btn" title="Comment">
        <FaRegComment size={15} style={{marginBottom:2}} />
        <span className="reel-action-label">{comments}</span>
      </button>
    </div>
  );
};

// Bottom navigation bar for home/saved
ReelActions.BottomNav = function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <nav className="reel-bottom-nav">
      <button
        className={`reel-bottom-nav-btn${location.pathname === '/' ? ' active' : ''}`}
        onClick={() => navigate('/')}
      >
        <FaHome size={22} />
        <span className="reel-bottom-nav-label">home</span>
      </button>
      <button
        className={`reel-bottom-nav-btn${location.pathname === '/saved' ? ' active' : ''}`}
        onClick={() => navigate('/saved')}
      >
        <FaUser size={22} />
        <span className="reel-bottom-nav-label">Me</span>
      </button>
    </nav>
  );
};

export default ReelActions;
