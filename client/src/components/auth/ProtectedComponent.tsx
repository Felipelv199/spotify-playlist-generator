import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { State } from '../../state';

interface ProtectedComponentProps {
  Component: React.ComponentType<any>;
  exact: boolean;
  path: string;
}

const ProtectedComponent = (restOfProps: ProtectedComponentProps) => {
  const auth = useSelector((state: State) => state.auth);
  const { Component, exact, path } = restOfProps;
  return (
    <Route
      exact={exact}
      path={path}
      render={(props) =>
        auth ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default ProtectedComponent;
