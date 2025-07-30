
export const hasUserLikedPost = (likes = [], userId) => {
  return likes.some((like) => like?.user?.toString?.() === userId);
};
