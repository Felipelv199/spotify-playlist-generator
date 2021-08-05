import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

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
  const getProfileInfo = async (token: string) => {
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
      const { data } = response;
      const { message } = data;
      setErrorMessage(message);
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
    <div>
      {errorMessage !== '' && (
        <div>
          <p>{errorMessage}</p>
        </div>
      )}
      <h1>Profile</h1>
      <div>
        {images.map((image, index) => (
          <img key={index.toString()} src={image.url} alt="avatar" />
        ))}
        <p>{name}</p>
        <p>{email}</p>
        <p>{product}</p>
      </div>
    </div>
  );
};

export default Profile;
