import React, { useState, useEffect } from 'react';
import api from '../api/apiService';
import useApi from '../hooks/useApi';
import { useNavigate, useParams } from 'react-router-dom';

export default function PostForm(){
  const { id } = useParams();
  const navigate = useNavigate();
  const { request, loading, error } = useApi();
  const [form, setForm] = useState({ title:'', content:'', categories: [] });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (id) {
      request(() => api.get(`/posts/${id}`)).then(data => setForm(data));
    }
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('content', form.content);
    fd.append('excerpt', form.excerpt || '');
    form.categories?.forEach(cat => fd.append('categories[]', cat));
    if (image) fd.append('featuredImage', image);

    try {
      if (id) {
        await api.raw.put(`/posts/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.raw.post('/posts', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="Title" />
      <textarea value={form.content} onChange={e=>setForm({...form, content:e.target.value})} placeholder="Content"/>
      <input type="file" onChange={e=>setImage(e.target.files[0])} />
      <button type="submit" disabled={loading}>{id ? 'Update' : 'Create'}</button>
      {error && <p style={{color:'red'}}>{error}</p>}
    </form>
  );
}
