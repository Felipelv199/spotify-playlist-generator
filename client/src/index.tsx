import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import { HOME, LOGIN, PROFILE } from './statics/routes/routes.json';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(
  <React.StrictMode>
    <Layout>
      <BrowserRouter>
        <Switch>
          <Route exact path={HOME} component={Home} />
          <Route exact path={LOGIN} component={Login} />
          <Route exact path={PROFILE} component={Profile} />
        </Switch>
      </BrowserRouter>
    </Layout>
  </React.StrictMode>,
  document.getElementById('root'),
);
