import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

// Helper to get token from state
const getToken = (getState) => getState().user.currentUser?.token;

// Helper to extract error message
const getErrorMessage = (error) => {
  console.error('API Error:', error);
  return (
    error.response?.data?.message ||
    error.message ||
    'Something went wrong'
  );
};

// Fetch posts
export const fetchTimelinePosts = createAsyncThunk(
  'posts/fetchTimelinePosts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const response = await axios.get(`${API}/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.posts;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Create a post
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const response = await axios.post(`${API}/posts`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Like a post
export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      await axios.post(`${API}/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return postId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Unlike a post
export const unlikePost = createAsyncThunk(
  'posts/unlikePost',
  async (postId, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      await axios.delete(`${API}/posts/${postId}/like`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return postId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Add a comment
export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, text }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const response = await axios.post(
        `${API}/posts/${postId}/comments`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { postId, comment: response.data };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Bookmark a post
export const bookmarkPost = createAsyncThunk(
  'posts/bookmarkPost',
  async (postId, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      await axios.post(`${API}/posts/${postId}/bookmarks`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return postId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Remove bookmark
export const removeBookmark = createAsyncThunk(
  'posts/removeBookmark',
  async (postId, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      await axios.delete(`${API}/posts/${postId}/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return postId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
