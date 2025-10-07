import React, { useState } from 'react';
import './CreateFood.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import jwt_decode from "jwt-decode";

const VideoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:8}}>
    <rect x="2" y="7" width="15" height="10" rx="2" fill="#218c74" stroke="#218c74" />
    <polygon points="17 9 22 7 22 17 17 15 17 9" fill="#0097a7" stroke="#0097a7" />
    <rect x="2" y="7" width="15" height="10" rx="2" stroke="#fff" strokeWidth="1.5" />
    <polygon points="17 9 22 7 22 17 17 15 17 9" stroke="#fff" strokeWidth="1.5" />
  </svg>
);

const CreateFood = () => {
  const [video, setVideo] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [preview, setPreview] = useState(null);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
      const formData = new FormData();
      formData.append('video', video);
      formData.append('name', name);
      formData.append('description', description);
      axios.post('http://localhost:3000/api/food', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
      })
      .then(response => {
          console.log('Food created:', response.data);
          alert('Food created successfully!');
          navigate('/');
      })
      .catch(error => {
          console.error('Error creating food:', error);
          alert('Error creating food. Please try again.');
      });
  };

  // const handleSkip = (e) => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     const decoded = jwt_decode(token);
  //     const partnerId = decoded.id;
  //   }
  //   navigate(`/food-partner/${partnerId}`);
  // }

  return (
    <div className="create-food-container">
      <div className="create-food-title">Create Food</div>
      <form className="create-food-form" onSubmit={handleSubmit}>
        <label className="create-food-label">Food Video</label>
        <label className="create-food-video-label">
          <VideoIcon />
          <span>{video ? video.name : 'Choose video file'}</span>
          <input
            className="create-food-input"
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            style={{ display: 'none' }}
          />
        </label>
        {preview && (
          <video src={preview} controls style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
        )}
        <label className="create-food-label">Food Name</label>
        <input
          className="create-food-input"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter food name"
          required
        />
        <label className="create-food-label">Description</label>
        <textarea
          className="create-food-textarea"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Enter description"
          required
        />
        <button className="create-food-btn" type="submit">Create</button>
        <div className="create-food-btn skip" onClick={() => navigate("/")}>Skip</div>
      </form>
      
    </div>
  );
};

export default CreateFood;