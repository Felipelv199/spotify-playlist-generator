import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { LOGIN } from '../statics/routes/routes.json';
import { SPOTIFY_USERS_ME } from '../statics/routes/server.json';
import { actionCreators } from '../state';
import MessageSpinner from '../components/utils/MessageSpinner';

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

const { Img, Body, Text, Title, Subtitle } = Card;

const Profile = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { logout } = bindActionCreators(actionCreators, dispatch);
  const [information, setInformation] = useState<ProfileInfo>();
  const [errorMessage, setErrorMessage] = useState('');
  const [show, setShow] = useState(false);

  const getProfileInfo = useCallback(
    async (token: string) => {
      setShow(false);
      try {
        const response = await axios.get(SPOTIFY_USERS_ME, {
          params: { token },
        });
        const { data } = response;
        const { display_name, images, product, email } = data;
        setInformation({ name: display_name, images, product, email });
      } catch (error) {
        const { response } = error;
        const { status, statusText } = response;
        if (status === 401) {
          logout();
        } else {
          setErrorMessage(statusText);
          setShow(true);
        }
      }
    },
    [logout],
  );

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token !== null && !information && !show) {
      getProfileInfo(token);
    } else if (token === null) {
      history.push(LOGIN);
    }
  }, [history, getProfileInfo, information, show]);

  if (!information) {
    return <MessageSpinner message="Loading" />;
  }

  const { name, email, product, images } = information;
  return (
    <Container
      style={{
        minHeight: 'calc(100vh - 56px)',
        alignItems: 'center',
        display: 'grid',
        justifyContent: 'center',
      }}
    >
      <Alert
        variant="danger"
        onClose={() => setShow(false)}
        show={show}
        dismissible
      >
        {errorMessage}
      </Alert>
      <Card
        bg="dark"
        border="dark"
        text="secondary"
        className="align-items-center"
        style={{
          padding: 25,
          boxShadow:
            '-10px 0px 13px -7px #000000, 10px 0px 13px -7px #000000, -2px 2px 15px 6px rgb(0 0 0 / 0%)',
        }}
      >
        {images.map((image, index) => (
          <Img
            key={index.toString()}
            src={image.url}
            alt="avatar"
            style={{ width: 250 }}
          />
        ))}
        <Body style={{ width: '100%' }}>
          <Title style={{ textAlign: 'center' }}>
            <strong>{name}</strong>
          </Title>
          <br />
          <Subtitle>
            <strong>Display Name</strong>
          </Subtitle>
          <Text>{name}</Text>
          <Subtitle>
            <strong>Email</strong>
          </Subtitle>
          <Text>{email}</Text>
          <Subtitle>
            <strong>Subscription</strong>
          </Subtitle>
          <Text>{product}</Text>
        </Body>
      </Card>
    </Container>
  );
};

export default Profile;
