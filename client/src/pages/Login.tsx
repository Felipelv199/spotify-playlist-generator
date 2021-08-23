import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import MessageSpinner from '../components/utils/MessageSpinner';
import { PROFILE } from '../statics/routes/routes.json';
import { SPOTIFY_AUTH, SPOTIFY_TOKEN } from '../statics/routes/server.json';

const Login = (props: any) => {
  const history = useHistory();
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

  const tokenSpotify = async (code: string) => {
    setShow(false);
    try {
      const response = await axios.post(SPOTIFY_TOKEN, {
        code,
      });
      const { data } = response;
      window.localStorage.setItem('token', data.token);
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
  };

  useEffect(() => {
    if (!window.localStorage.getItem('token')) {
      const paramsString = search.slice(1);
      const params = new URLSearchParams(paramsString);
      const code = params.get('code');
      if (code === null) {
        authenticateSpotify();
      } else {
        tokenSpotify(code);
      }
    } else {
      history.push(PROFILE);
    }
  }, [search]);

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
