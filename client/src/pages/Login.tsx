import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';

function App(props: any) {
  const history = useHistory();
  const { location } = props;
  const { search } = location;
  const [errorMessage, setErrorMessage] = useState('');
  const [show, setShow] = useState(false);

  const authenticateSpotify = async () => {
    setShow(false);
    try {
      const response = await axios.get('http://localhost:8080/spotify/auth');
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
      const response = await axios.post('http://localhost:8080/spotify/token', {
        code,
      });
      const { data } = response;
      window.localStorage.setItem('token', data.token);
      history.push('/profile');
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
    }
  }, [search]);

  return (
    <Container className="App">
      <Alert
        variant="danger"
        onClose={() => setShow(false)}
        show={show}
        dismissible
      >
        {errorMessage}
      </Alert>
    </Container>
  );
}

export default App;
