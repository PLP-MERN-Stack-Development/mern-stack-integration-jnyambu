import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/apiService';
import useApi from '../hooks/useApi';
import AppContext from '../context/AppContext';

export default function PostView(){
  const { id } = useParams();
  const { loading, error, request } = useApi();
  const [post, setPost] = useState(null);
  useEffect(() => {
    request(() => api.get(`/posts/${id}`)).then(data => setPost(data));
  }, [id]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{color:'red'}}>{error}</p>;
  if (!post) return <p>Not found</p>;
  return (
    <article>
      <h1>{post.title}</h1>
      {post.featuredImage && <img src={import.meta.env.VITE_API_URL.replace('/api','') + post.featuredImage} alt={post.title} style={{maxWidth:'400px'}}/>}
      <div dangerouslySetInnerHTML={{__html:post.content}} />
      <section>
        <h3>Comments</h3>
        <ul>
          {post.comments?.map((c,i)=> <li key={i}><b>{c.authorName}</b>: {c.content}</li>)}
        </ul>
      </section>
    </article>
  );
}
