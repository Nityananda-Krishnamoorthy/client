export const formatCount = (count) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count;
};

export const validateImage = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  const maxSize = 2 * 1024 * 1024; // 2MB
  
  if (!validTypes.includes(file.type)) {
    return 'Invalid file type. Only JPEG, PNG, JPG, and WEBP are allowed.';
  }
  
  if (file.size > maxSize) {
    return 'File size exceeds 2MB limit.';
  }
  
  return null;
};