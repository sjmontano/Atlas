import React, { useState, useRef, useEffect } from "react";
import "./AudioPlayer.css";

// Rutas a iconos en public
const closeIcon = "/assets/interface/icons/line/svg/close.svg";
const playIcon = "/assets/interface/icons/line/svg/play.svg";

const AudioPlayer = ({ src, title, onClose, onPlayStateChange, autoPlay = true }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (src && audioRef.current) {
      audioRef.current.src = src;
      if (autoPlay) {
        audioRef.current.play().catch((e) => console.error("Error playing audio:", e));
        setIsPlaying(true);
        onPlayStateChange && onPlayStateChange(true);
      } else {
        setIsPlaying(false);
        onPlayStateChange && onPlayStateChange(false);
      }
    }
  }, [src, autoPlay]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      onPlayStateChange && onPlayStateChange(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (!isDragging && audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSeekStart = () => setIsDragging(true);
  const handleSeekEnd = (e) => {
    setIsDragging(false);
    if (audioRef.current) {
      audioRef.current.currentTime = Number(e.target.value);
    }
  };

  const skipTime = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onPlayStateChange && onPlayStateChange(false);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="audio-player-container">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      
      <div className="audio-player-header">
        <div className="audio-info-marquee">
          <div className="marquee-content">
            <span>{title || "Audio"}</span>
            {/* Duplicamos para efecto infinito si es necesario, CSS lo manejará */}
            <span className="marquee-spacer"> &nbsp; - &nbsp; </span>
            <span>{title || "Audio"}</span>
          </div>
        </div>
        <button className="close-btn" onClick={onClose} aria-label="Cerrar">
          <img src={closeIcon} alt="Cerrar" style={{ width: '14px', height: '14px' }} />
        </button>
      </div>

      <div className="audio-player-controls">
        <div className="control-buttons">
          <button onClick={() => skipTime(-10)} className="skip-btn" title="-10s">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
             </svg>
             <span className="skip-text">-10</span>
          </button>

          <button onClick={togglePlay} className="play-pause-btn">
            {isPlaying ? (
              <svg className="player-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="player-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                 <path d="M8 5V19L19 12L8 5Z" />
              </svg>
            )}
          </button>

          <button onClick={() => skipTime(10)} className="skip-btn" title="+10s">
            <span className="skip-text">+10</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
             </svg>
          </button>
        </div>

        <div className="progress-container">
          <span className="time-current">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            onMouseDown={handleSeekStart}
            onMouseUp={handleSeekEnd}
            onTouchStart={handleSeekStart}
            onTouchEnd={handleSeekEnd}
            className="progress-bar"
          />
          <span className="time-duration">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
