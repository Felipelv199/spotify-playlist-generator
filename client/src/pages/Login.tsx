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

const Login = (props: any) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { login } = bindActionCreators(actionCreators, dispatch);
  const auth = useSelector((state: State) => state.auth);
  const { location } = props;
  const { search } = location;
  const [errorMessage, setErrorMessage] = useState('');
  const [show, setShow] = useState(false);

  const authenticateSpotify = async () => {
    setShow(false);
    try {
      const response = await axios.get(SPOTIFY_AUTH);
      const { data } = response;
      window.location.href = data.url;
    } catch (error) {
      const { response } = error;
      if (!response) {
        setErrorMessage(error.message);
      } else {
        const { data } = response;
        const { message } = data;
        setErrorMessage(message);
      }
      setShow(true);
    }
  };

  const tokenSpotify = useCallback(
    async (code: string) => {
      setShow(false);
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
        const { response } = error;
        if (!response) {
          setErrorMessage(error.message);
        } else {
          const { data } = response;
          const { message } = data;
          setErrorMessage(message);
        }
        setShow(true);
      }
    },
    [history, login],
  );

  useEffect(() => {
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
  }, [search, auth, history, login, tokenSpotify]);

  return (
    <Container>
      {!show && <MessageSpinner message="Authenticating..." />}
      <Alert
        variant="danger"
        onClose={() => setShow(false)}
        show={show}
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
