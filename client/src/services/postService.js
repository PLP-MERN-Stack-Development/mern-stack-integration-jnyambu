import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Post services
export const getPosts = () => axios.get(`${API_URL}/api/posts`);
export const getPost = (id) => axios.get(`${API_URL}/api/posts/${id}`);
export const createPost = (post, token) => 
  axios.post(`${API_URL}/api/posts`, post, {
    headers: { Authorization: `Bearer ${token}` }
  });