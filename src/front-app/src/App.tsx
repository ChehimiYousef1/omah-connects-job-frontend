import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Feed from './Pages/Feed';
import Freelancing from './Pages/Freelancing';
import Message from './Pages/Message';
import MyNetwork from './Pages/MyNetwork';
import Notification from './Pages/Notification';
import Profile from './Pages/Profile';

import './App.css';

function App() {
  return (
     <div id="react-omah-jobs">
      <BrowserRouter>
        <Routes>
          {/* Redirect "/" to "/feed" */}
          <Route path="/" element={<Navigate to="/feed" replace />} />

          {/* Main pages */}
          <Route path="/feed" element={<Feed />} />
          <Route path="/freelancing" element={<Freelancing />} />
          <Route path="/message" element={<Message />} />
          <Route path="/mynetwork" element={<MyNetwork />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/profile" element={<Profile />} />

          {/* Fallback for unknown routes */}
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
