import React from 'react';
import { Outlet } from 'react-router-dom';
import './SocialFeedLayout.css';

export const SocialFeedLayout: React.FC = () => {
  return (
    <div className="social-feed-layout w-screen h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 w-full">
        <Outlet />
      </div>
    </div>
  );
};
