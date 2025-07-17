import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

const PublicLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PublicHeader />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
