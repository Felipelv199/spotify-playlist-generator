import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-bootstrap';
import Header from './Header';
import { SPOTIFY_USERS_ME } from '../../statics/routes/server.json';
import { actionCreators } from '../../state';
import appError from '../../utils/appError';

const Layout = (props: any) => {
  const { children } = props;
  const dispatch = useDispatch();
  const { logout, setProfile, removeProfile } = bindActionCreators(
    actionCreators,
    dispatch,
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [displayAlert, setDisplayAlert] = useState(false);

  useEffect(() => {
    const getProfile = async (token: string) => {
      try {
        const response = await axios.get(SPOTIFY_USERS_ME, {
          params: { token },
        });
        const { data } = response;
        const clientId: string = data.id!;
        setProfile(clientId);
      } catch (error) {
        if (appError.isUnauthorized(error)) {
          logout();
          removeProfile();
        }
        setErrorMessage(appError.onError(error));
        setDisplayAlert(true);
      }
    };
    const token = window.localStorage.getItem('token');
    if (token !== null) {
      getProfile(token);
    }
  }, [setProfile, logout, removeProfile]);

  return (
    <div>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 56px)' }}>
        <Alert
          variant="danger"
          onClose={() => setDisplayAlert(false)}
          show={displayAlert}
          dismissible
        >
          {errorMessage}
        </Alert>
        {children}
      </div>
    </div>
  );
};

export default Layout;
