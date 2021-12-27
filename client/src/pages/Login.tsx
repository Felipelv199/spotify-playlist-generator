import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import MessageSpinner from '../components/utils/MessageSpinner';
import { PROFILE } from '../statics/routes/routes.json';
import { SPOTIFY_AUTH, SPOTIFY_TOKEN } from '../statics/routes/server.json';
import { actionCreators, State } from '../state';
import appError from '../utils/appError';

const Login = (props: any) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { login, logout } = bindActionCreators(actionCreators, dispatch);
  const auth = useSelector((state: State) => state.auth);
  const { location } = props;
  const { search } = location;
  const [errorMessage, setErrorMessage] = useState('');
  const [displayAlert, setDisplayAlert] = useState(false);

  const tokenSpotify = useCallback(
    async (code: string) => {
      setDisplayAlert(false);
      try {
        const response = await axios.post(SPOTIFY_TOKEN, {
          code,
        });
        const { data } = response;
        const { token } = data;
        window.localStorage.setItem('token', token);
        login(token);
        history.push(PROFILE);
      } catch (error) {
        if (appError.isUnauthorized(error)) {
          logout();
        }
        setErrorMessage(appError.onError(error));
        setDisplayAlert(true);
      }
    },
    [history, login, logout],
  );

  useEffect(() => {
    const authenticateSpotify = async () => {
      setDisplayAlert(false);
      try {
        const response = await axios.get(SPOTIFY_AUTH);
        const { data } = response;
        window.location.href = data.url;
      } catch (error) {
        if (appError.isUnauthorized(error)) {
          logout();
        }
        setErrorMessage(appError.onError(error));
        setDisplayAlert(true);
      }
    };
    if (!auth) {
      const token = window.localStorage.getItem('token');
      if (!token) {
        const paramsString = search.slice(1);
        const params = new URLSearchParams(paramsString);
        const code = params.get('code');
        if (code === null) {
          authenticateSpotify();
        } else {
          tokenSpotify(code);
        }
      } else {
        login(token);
        history.push(PROFILE);
      }
    } else {
      history.push(PROFILE);
    }
  }, [search, auth, history, login, tokenSpotify, logout]);

  return (
    <Container>
      {!displayAlert && <MessageSpinner message="Authenticating..." />}
      <Alert
        variant="danger"
        onClose={() => setDisplayAlert(false)}
        show={displayAlert}
        dismissible
        style={{
          marginTop: 16,
        }}
      >
        {errorMessage}
      </Alert>
    </Container>
  );
};

export default Login;
