import React from 'react';
import Header from './Header';

const Layout = (props: any) => {
  const { children } = props;
  return (
    <div>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 56px)' }}>{children}</div>
    </div>
  );
};

export default Layout;
