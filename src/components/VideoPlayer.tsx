import React, { useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { getVideoUrl } from '../utils/videoUtils';
import AudioEqualizer from './AudioEqualizer';

interface VideoPlayerProps {
  url: string;
  title: string;
  onError: (error: string) => void;
  index: number;
}

const VideoPlayer = ({ url, title, onError, index }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [volume, setVolume] = React.useState(1);
  const [isYouTube, setIsYouTube] = React.useState(false);

  useEffect(() => {
    const processedUrl = getVideoUrl(url);
    setIsYouTube(processedUrl.includes('youtube.com/embed/'));
  }, [url]);

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

  const processedUrl = getVideoUrl(url);

  return (
    <div className="rounded-lg overflow-hidden bg-background border border-border p-4 animate-fade-in">
      <div className="relative">
        {isYouTube ? (
          <iframe
            ref={iframeRef}
            className="w-full rounded-lg aspect-video bg-black"
            src={`${processedUrl}?enablejsapi=1&origin=${window.location.origin}`}
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
        <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-2 flex items-center gap-2">
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
  );
};

export default VideoPlayer;