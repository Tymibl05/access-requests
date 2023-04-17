import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Nav = () => {
  const navigate = useNavigate();
  const searchRef = useRef();
  const submitSearch = (e) => {
    e.preventDefault();
    const search =
      `${searchRef.current.value.slice(0, 3).toUpperCase()}` +
      `${searchRef.current.value.slice(3)}`;
    (async () => {
      const url = `http://localhost:5000/api/requests/by-name/${search}`;
      const res = await fetch(url);
      if (!res.ok) {
        const error = await res.json();
        console.log(error.message);
        return;
      }
      const result = await res.json();
      searchRef.current.value = '';
      return navigate(`/request/${result._id}`);
    })();
  };
  return (
    <nav>
      <Link to="/">
        <h2>Access</h2>
      </Link>
      <div>
        <button onClick={() => navigate('/new-request')}>+ New</button>
        <form onSubmit={submitSearch}>
          <input
            type="text"
            name="search"
            placeholder="Search for request..."
            ref={searchRef}
          />
        </form>
      </div>
    </nav>
  );
};
