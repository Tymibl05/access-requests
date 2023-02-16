import React from 'react';
import { useStore } from './Context';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignIn } from './pages/signin/SignIn';
import { Home } from './pages/home/Home';

import './App.scss';
import { Request } from './pages/request/Request';
import { Nav } from './Nav';
import { NewReq } from './pages/newReq/NewReq';

function App() {
  const {
    state: { user },
  } = useStore();
  return (
    <div id="App">
      {!user ? (
        <SignIn />
      ) : (
        <BrowserRouter>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/request/:req_id" element={<Request />} />
            <Route path="/new-request" element={<NewReq />} />
          </Routes>
          <footer>
            <h2>Footer</h2>
          </footer>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
