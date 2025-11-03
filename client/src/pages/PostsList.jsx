import React, { useEffect, useContext, useState } from 'react';
import AppContext from '../context/AppContext';
import api from '../api/apiService';
import useApi from '../hooks/useApi';
import { Link } from 'react-router-dom';

export default function PostsList(){
  const { state, dispatch } = useContext(AppContext);
  const { loading, error, request } = useApi();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');

  const fetchPosts = async () => {
    const data = await request(() => api.get(`/posts?page=${page}&q=${encodeURIComponent(q)}`));
    dispatch({ type: 'SET_POSTS', posts: data.data, meta: data.meta });
  };

  useEffect(() => { fetchPosts(); }, [page, q]);

  return (
    <div>
      <div><input placeholder="Search" value={q} onChange={(e)=>setQ(e.target.value)} /></div>
      {loading && <p>Loading...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      <ul>
        {state.posts.map(p => (
          <li key={p._id}><Link to={`/posts/${p._id}`}>{p.title}</Link></li>
        ))}
      </ul>
      <div>
        <button onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
        <span>Page {page}</span>
        <button onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </div>
  );
}
