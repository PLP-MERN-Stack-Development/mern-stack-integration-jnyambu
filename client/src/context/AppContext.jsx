import React, { createContext, useReducer, useEffect } from 'react';
import api from '../api/apiService';

const AppContext = createContext();

const initialState = {
  posts: [],
  categories: [],
  meta: {}
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_POSTS': return { ...state, posts: action.posts, meta: action.meta };
    case 'ADD_POST': return { ...state, posts: [action.post, ...state.posts] };
    case 'UPDATE_POST': return { ...state, posts: state.posts.map(p => p._id === action.post._id ? action.post : p) };
    case 'DELETE_POST': return { ...state, posts: state.posts.filter(p => p._id !== action.id) };
    case 'SET_CATEGORIES': return { ...state, categories: action.categories };
    default: return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchCategories = async () => {
    const res = await api.get('/categories');
    dispatch({ type: 'SET_CATEGORIES', categories: res.data });
  };

  useEffect(() => { fetchCategories(); }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
