import React from 'react';
import { useStore } from './Context';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignIn } from './pages/signin/SignIn';
import { Home } from './pages/home/Home';

import './App.scss';

function App() {
  const {
    state: { user },
  } = useStore();
  return (
    <div id="App">
      <nav>
        <h2>Nav</h2>
      </nav>
      {!user ? (
        <SignIn />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      )}
      <footer>
        <h2>Footer</h2>
      </footer>
    </div>
  );
}

export default App;
