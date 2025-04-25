'use client'
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import './CustomVideoPlayer.css';

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  onLoadedMetadata?: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
}

// Define the ref type
export interface VideoPlayerRef {
  play: () => Promise<void> | void;
  pause: () => void;
  currentTime: number;
}

const CustomVideoPlayer = forwardRef<VideoPlayerRef, CustomVideoPlayerProps>(({
  src,
  poster,
  width = '100%',
  height = 'auto',
  className = '',
  autoPlay = true,
  loop = true,
  muted = false,
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [showPlayAnimation, setShowPlayAnimation] = useState(false);
  const [showPauseAnimation, setShowPauseAnimation] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Expose the video methods via ref
  useImperativeHandle(ref, () => ({
    play: () => {
      if (videoRef.current) {
        const playPromise = videoRef.current.play();
        setIsPlaying(true);
        return playPromise;
      }
    },
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    },
    get currentTime() {
      return videoRef.current?.currentTime || 0;
    },
    set currentTime(value: number) {
      if (videoRef.current) {
        videoRef.current.currentTime = value;
      }
    }
  }));

  // Handle play/pause toggle
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setShowPauseAnimation(true); 
        
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }
        animationTimeoutRef.current = setTimeout(() => {
          setShowPauseAnimation(false);
        }, 1000);
      } else {
        videoRef.current.play().catch((error) => {
          console.log("Play was prevented:", error);
        });
        setShowPlayAnimation(true); 
        
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }
        animationTimeoutRef.current = setTimeout(() => {
          setShowPlayAnimation(false);
        }, 1000);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
      
      if (autoPlay) {
        const playPromise = videoRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
            })
            .catch(error => {
              console.log("Autoplay was prevented:", error);
              setIsPlaying(false);
            });
        }
      }
    }
    
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [autoPlay, muted]);

  return (
    <div className={`custom-video-container bg-gradient-to-br from-zinc-400 via-gray-200 to-zinc-400 shadow-lg ${className}`} style={{ width, height }}>
      <video
        ref={videoRef}
        className="custom-video rounded-none"
        src={src}
        poster={poster}
        loop={loop}
        playsInline
        onClick={togglePlayPause}
        controls={false} 
      />
      
      {!isPlaying && (
        <div className="play-button-container">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="play-button">
            <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.5)" />
            <path d="M9 7.5L17 12L9 16.5V7.5Z" fill="white" />
          </svg>
        </div>
      )}
      
      {showPlayAnimation && (
        <div className="play-animation">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.5)" />
            <path d="M9 7.5L17 12L9 16.5V7.5Z" fill="white" />
          </svg>
        </div>
      )}
      
      {showPauseAnimation && (
        <div className="pause-animation">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.5)" />
            <rect x="8" y="7" width="3" height="10" rx="1" fill="white" />
            <rect x="13" y="7" width="3" height="10" rx="1" fill="white" />
          </svg>
        </div>
      )}
      
      <div className="video-controls">
        <button 
          className={`sound-control ${isMuted ? 'muted' : 'unmuted'}`}
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.889 16H2a1 1 0 01-1-1V9a1 1 0 011-1h3.889l5.294-4.332a.5.5 0 01.817.387v15.89a.5.5 0 01-.817.387L5.89 16z" fill="white"/>
              <path d="M23 9l-6 6M17 9l6 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.889 16H2a1 1 0 01-1-1V9a1 1 0 011-1h3.889l5.294-4.332a.5.5 0 01.817.387v15.89a.5.5 0 01-.817.387L5.89 16z" fill="white"/>
              <path d="M15 7c1.66 0 3 1.34 3 3s-1.34 3-3 3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M15 4c3.31 0 6 2.69 6 6s-2.69 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
});

CustomVideoPlayer.displayName = 'CustomVideoPlayer';

export default CustomVideoPlayer;