import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import PostsList from './pages/PostsList';
import PostView from './pages/PostView';
import PostForm from './pages/PostForm';
import Auth from './pages/Auth';

export default function App() {
  return (
    <>
      <Nav />
      <main className="container">
        <Routes>
          <Route path="/" element={<PostsList />} />
          <Route path="/posts/:id" element={<PostView />} />
          <Route path="/posts/new" element={<PostForm />} />
          <Route path="/posts/:id/edit" element={<PostForm />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
    </>
  )
}
