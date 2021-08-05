import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function App(props: any) {
  const history = useHistory();
  const { location } = props;
  const { search } = location;

  const [errorMessage, setErrorMessage] = useState('');
  const authenticateSpotify = async () => {
    setErrorMessage('');
    try {
      const response = await axios.get('http://localhost:8080/spotify/auth');
      const { data } = response;
      window.location.href = data.url;
    } catch (error) {
      const { response } = error;
      const { data } = response;
      const { message } = data;
      setErrorMessage(message);
    }
  };
  const tokenSpotify = async (code: string) => {
    setErrorMessage('');
    try {
      const response = await axios.post('http://localhost:8080/spotify/token', {
        code,
      });
      const { data } = response;
      window.localStorage.setItem('token', data.token);
      history.push('/profile');
    } catch (error) {
      const { response } = error;
      const { data } = response;
      const { message } = data;
      setErrorMessage(message);
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
    <div className="App">
      {errorMessage !== '' && (
        <div>
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
}

export default App;
