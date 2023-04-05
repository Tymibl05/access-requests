import React from 'react';
import { useStore } from '../../Context';

export const SignIn = () => {
  const { dispatch } = useStore();

  const signin = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:5000/api/users/signin';
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.message);
      return;
    }
    const result = await res.json();
    dispatch.signin(result);
  };

  return (
    <div id="SignIn">
      <div className="card">
        <form onSubmit={signin}>
          <div>
            <label htmlFor="">Email</label>
            <input type="email" name="email" required />
          </div>
          <div>
            <label htmlFor="">Password</label>
            <input type="password" name="password" required />
          </div>
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
};
