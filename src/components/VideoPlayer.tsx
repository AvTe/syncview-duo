import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { getVideoUrl } from '../utils/videoUtils';
import AudioEqualizer from './AudioEqualizer';
import { createAudioNodes } from '../utils/audioContext';
import { audioProcessor } from '../services/audioProcessor';

interface VideoPlayerProps {
  url: string;
  title: string;
  onError: (error: string) => void;
  index: number;
}

const VideoPlayer = ({ url, title, onError, index }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isYouTube, setIsYouTube] = useState(false);

  useEffect(() => {
    const processedUrl = getVideoUrl(url);
    setIsYouTube(processedUrl.includes('youtube.com/embed/'));
  }, [url]);

  useEffect(() => {
    if (!isYouTube && videoRef.current) {
      const video = videoRef.current;
      
      // Initialize audio nodes
      try {
        const nodes = createAudioNodes(video);
        audioProcessor.setNodes(nodes);
      } catch (error) {
        console.error('Failed to initialize audio nodes:', error);
      }

      const timeUpdate = () => {
        setCurrentTime(video.currentTime);
      };

      const loadedMetadata = () => {
        setDuration(video.duration);
      };

      video.addEventListener('timeupdate', timeUpdate);
      video.addEventListener('loadedmetadata', loadedMetadata);

      return () => {
        video.removeEventListener('timeupdate', timeUpdate);
        video.removeEventListener('loadedmetadata', loadedMetadata);
      };
    }
  }, [isYouTube]);

  useEffect(() => {
    if (isYouTube) {
      // Listen for YouTube player messages
      const handleMessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === 'onStateChange' && data.info === 1) {
            // Video is playing
            setIsPlaying(true);
          } else if (data.event === 'onStateChange' && (data.info === 2 || data.info === 0)) {
            // Video is paused or ended
            setIsPlaying(false);
          } else if (data.event === 'getDuration') {
            setDuration(data.info);
          } else if (data.event === 'getCurrentTime') {
            setCurrentTime(data.info);
          }
        } catch (e) {
          // Ignore invalid messages
        }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [isYouTube]);

  const togglePlay = () => {
    if (isYouTube && iframeRef.current) {
      const message = isPlaying ? '{"event":"command","func":"pauseVideo","args":""}' : '{"event":"command","func":"playVideo","args":""}';
      iframeRef.current.contentWindow?.postMessage(message, '*');
      setIsPlaying(!isPlaying);
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error) => {
          onError(`Failed to play video: ${error.message}`);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (isYouTube && iframeRef.current) {
      const message = isMuted ? '{"event":"command","func":"unMute","args":""}' : '{"event":"command","func":"mute","args":""}';
      iframeRef.current.contentWindow?.postMessage(message, '*');
      setIsMuted(!isMuted);
    } else if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (isYouTube && iframeRef.current) {
      const message = `{"event":"command","func":"setVolume","args":[${newVolume * 100}]}`;
      iframeRef.current.contentWindow?.postMessage(message, '*');
    } else if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setVolume(newVolume);
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (isYouTube && iframeRef.current) {
      const message = `{"event":"command","func":"seekTo","args":[${time},true]}`;
      iframeRef.current.contentWindow?.postMessage(message, '*');
      setCurrentTime(time);
    } else if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleFullscreen = () => {
    const element = isYouTube ? iframeRef.current : videoRef.current;
    if (element) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        element.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const processedUrl = getVideoUrl(url);

  return (
    <div className="rounded-lg overflow-hidden bg-background border border-border p-4 animate-fade-in">
      <div className="relative">
        {isYouTube ? (
          <iframe
            ref={iframeRef}
            className="w-full rounded-lg aspect-video bg-black"
            src={`${processedUrl}?enablejsapi=1&controls=0&origin=${window.location.origin}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onError={() => onError(`Failed to load video: ${title}`)}
          />
        ) : (
          <video
            ref={videoRef}
            className="w-full rounded-lg aspect-video bg-black"
            src={processedUrl}
            onError={() => onError(`Failed to load video: ${title}`)}
          >
            Your browser does not support the video tag.
          </video>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-2 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleTimelineChange}
              className="w-full h-1 bg-foreground/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="text-foreground hover:text-primary transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={toggleMute}
              className="text-foreground hover:text-primary transition-colors"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-foreground/20 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-foreground/80">
              {formatTime(currentTime)} / {formatTime(duration || 0)}
            </span>
            <AudioEqualizer videoIndex={index} />
            <button
              onClick={toggleFullscreen}
              className="text-foreground hover:text-primary transition-colors ml-auto"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;