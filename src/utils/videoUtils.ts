export const getVideoUrl = (url: string): string => {
  try {
    const videoUrl = new URL(url);
    
    // Handle YouTube URLs
    if (videoUrl.hostname.includes('youtube.com') || videoUrl.hostname.includes('youtu.be')) {
      // Extract video ID
      let videoId = '';
      if (videoUrl.hostname.includes('youtube.com')) {
        videoId = videoUrl.searchParams.get('v') || '';
      } else {
        videoId = videoUrl.pathname.slice(1);
      }
      
      // Return direct video URL
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Return the original URL for direct video files
    return url;
  } catch {
    return url;
  }
};