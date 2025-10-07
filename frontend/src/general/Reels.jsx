import React, { useRef, useState, useEffect } from 'react';
import { fetchReelsData } from './reelsData';
import '../assets/auth.css';
import './Reels.css';
import ReelActions from './ReelActions';
import { useNavigate } from 'react-router-dom';

const MAX_LINES = 2;

function TruncatedDescription({ description }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef();
  const [truncated, setTruncated] = useState(false);

  React.useEffect(() => {
    if (ref.current) {
      setTruncated(ref.current.scrollHeight > ref.current.clientHeight);
    }
  }, [description]);

  return (
    <div>
      <div
        ref={ref}
        className={`desc-text${expanded ? ' expanded' : ''}`}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: expanded ? 'unset' : MAX_LINES,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {description}
      </div>
      {!expanded && truncated && (
        <span className="desc-more" onClick={() => setExpanded(true)}>
          ...more
        </span>
      )}
      {expanded && (
        <span className="desc-more" onClick={() => setExpanded(false)}>
          show less
        </span>
      )}
    </div>
  );
}



const Reels = () => {
  const [reels, setReels] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for down, -1 for up
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef();
  const navigate = useNavigate();

  // Fetch reels from backend on mount
  useEffect(() => {
    fetchReelsData().then(setReels);
  }, []);

  // Scroll event handler to animate to next/prev video
  const handleWheel = (e) => {
    if (isAnimating || reels.length === 0) return;
    if (e.deltaY > 0 && currentIdx < reels.length - 1) {
      setDirection(1);
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIdx((idx) => idx + 1);
        setIsAnimating(false);
      }, 350);
    } else if (e.deltaY < 0 && currentIdx > 0) {
      setDirection(-1);
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIdx((idx) => idx - 1);
        setIsAnimating(false);
      }, 350);
    }
  };

  // Touch event handlers for swipe up/down
  const touchStartY = useRef(null);
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartY.current = e.touches[0].clientY;
    }
  };
  const handleTouchEnd = (e) => {
    if (isAnimating || touchStartY.current === null || reels.length === 0) return;
    const endY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - endY;
    if (deltaY > 40 && currentIdx < reels.length - 1) {
      // Swipe up
      setDirection(1);
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIdx((idx) => idx + 1);
        setIsAnimating(false);
      }, 350);
    } else if (deltaY < -40 && currentIdx > 0) {
      // Swipe down
      setDirection(-1);
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIdx((idx) => idx - 1);
        setIsAnimating(false);
      }, 350);
    }
    touchStartY.current = null;
  };

  // Keyboard navigation (optional)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAnimating || reels.length === 0) return;
      if (e.key === 'ArrowDown' && currentIdx < reels.length - 1) {
        setDirection(1);
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentIdx((idx) => idx + 1);
          setIsAnimating(false);
        }, 350);
      } else if (e.key === 'ArrowUp' && currentIdx > 0) {
        setDirection(-1);
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentIdx((idx) => idx - 1);
          setIsAnimating(false);
        }, 350);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, reels.length, isAnimating]);

  // Animation logic: show current and next/prev video stacked, animate translateY
  const getVideosToShow = () => {
    if (reels.length === 0) return [];
    const videos = [];
    if (direction === 1 && currentIdx < reels.length - 1) {
      // Scrolling down: current and next
      videos.push({ ...reels[currentIdx], pos: 0 });
      videos.push({ ...reels[currentIdx + 1], pos: 1 });
    } else if (direction === -1 && currentIdx > 0) {
      // Scrolling up: prev and current
      videos.push({ ...reels[currentIdx - 1], pos: -1 });
      videos.push({ ...reels[currentIdx], pos: 0 });
    } else {
      // Only current
      videos.push({ ...reels[currentIdx], pos: 0 });
    }
    return videos;
  };

  const videosToShow = getVideosToShow();

  return (
    <div
      className="reels-container"
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      style={{ outline: 'none', overflow: 'hidden' }}
    >
      <div className="reels-stack">
        {videosToShow.map((video, i) => {
          let translateY = 0;
          if (isAnimating) {
            if (direction === 1) {
              // Down: current moves up, next comes in
              translateY = video.pos === 0 ? '-100%' : '0%';
            } else if (direction === -1) {
              // Up: prev comes in, current moves down
              translateY = video.pos === 0 ? '100%' : '0%';
            }
          } else {
            translateY = '0%';
          }
          return (
            <div
              className="reel"
              key={video.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                transition: 'transform 0.35s cubic-bezier(.4,1.6,.6,1)',
                transform: `translateY(${translateY})`,
                zIndex: video.pos === 0 ? 2 : 1,
              }}
            >
              <video
                className="reel-video"
                src={video.videoUrl}
                controls={false}
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="reel-overlay">
                <div className="reel-user">@{video.userName}</div>
                <TruncatedDescription description={video.description} />
                <button
                  className="reel-store-btn"
                  onClick={() => navigate(`/food-partner/${video.storeUrl}`)}
                >
                  Visit Store
                </button>
              </div>
              {/* Add right-side actions */}
              <ReelActions foodId={video.id} likes={video.likes} saves={video.saves} comments={video.comments} />
            </div>
          );
        })}
      </div>
      {/* Add bottom nav for home/saved */}
      <ReelActions.BottomNav />
    </div>
  );
};

export default Reels;
