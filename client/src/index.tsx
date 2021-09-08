import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import { HOME, LOGIN, PROFILE, TRACKS } from './statics/routes/routes.json';
import { store } from './state/index';
import 'bootstrap/dist/css/bootstrap.css';
import ProtectedComponent from './components/auth/ProtectedComponent';
import NotFound from './pages/NotFound';
import Tracks from './pages/Tracks';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path={HOME} component={Home} />
            <Route exact path={LOGIN} component={Login} />
            <ProtectedComponent exact path={PROFILE} Component={Profile} />
            <ProtectedComponent exact path={TRACKS} Component={Tracks} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
