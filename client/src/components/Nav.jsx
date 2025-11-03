import React from 'react';
import { Link } from 'react-router-dom';

export default function Nav() {
  const logged = !!localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand">MERN Blog</Link>
        <div>
          <Link to="/">Posts</Link>
          {logged ? (
            <>
              <Link to="/posts/new">New</Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/auth">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
