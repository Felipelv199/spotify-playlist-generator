import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';

interface Image {
  height: number;
  url: string;
  width: number;
}

interface ProfileInfo {
  name: string;
  email: string;
  images: [Image];
  product: string;
}

const Profile = () => {
  const history = useHistory();
  const [information, setInformation] = useState<ProfileInfo>();
  const [errorMessage, setErrorMessage] = useState('');
  const [show, setShow] = useState(false);

  const getProfileInfo = async (token: string) => {
    setShow(false);
    try {
      const response = await axios.get(
        'http://localhost:8080/spotify/users/me',
        {
          params: { token },
        },
      );
      const { data } = response;
      const { display_name, images, product, email } = data;
      setInformation({ name: display_name, images, product, email });
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
    const token = window.localStorage.getItem('token');
    if (token !== null) {
      getProfileInfo(token);
    } else {
      history.push('/login');
    }
  }, []);
  if (!information) {
    return null;
  }

  const { name, email, product, images } = information;
  return (
    <Container>
      <Alert
        variant="danger"
        onClose={() => setShow(false)}
        show={show}
        dismissible
      >
        {errorMessage}
      </Alert>
      <h1>Profile</h1>
      <div>
        {images.map((image, index) => (
          <img key={index.toString()} src={image.url} alt="avatar" />
        ))}
        <p>{name}</p>
        <p>{email}</p>
        <p>{product}</p>
      </div>
    </Container>
  );
};

export default Profile;
