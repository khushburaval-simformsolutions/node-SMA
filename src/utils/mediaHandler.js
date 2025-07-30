const isValidMediaUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const getMediaType = (url) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const videoExtensions = ['.mp4', '.mov', '.avi'];
  
  const extension = url.toLowerCase().match(/\.[^/.]+$/)?.[0];
  
  if (imageExtensions.includes(extension)) return 'image';
  if (videoExtensions.includes(extension)) return 'video';
  return null;
};

module.exports = {
  isValidMediaUrl,
  getMediaType
};