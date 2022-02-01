import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { HOME, LOGIN, PROFILE, TRACKS } from '../../statics/routes/routes.json';
import { State, actionCreators } from '../../state';

const { Brand } = Navbar;

const Header = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { logout, login, removeProfile } = bindActionCreators(
    actionCreators,
    dispatch,
  );
  const [logged, setLogged] = useState(false);
  const auth = useSelector((state: State) => state.auth);
  const token = window.localStorage.getItem('token');

  const onClickLogout = () => {
    logout();
    removeProfile();
  };

  useEffect(() => {
    if (token) {
      login(token);
    }
    if (!auth) {
      setLogged(false);
    } else {
      setLogged(true);
    }
  }, [auth, login, token]);

  return (
    <Navbar bg="dark" variant="dark">
      <Container fluid>
        <Brand>Playlist Generator</Brand>
        <Nav className="me-auto">
          <Button variant="dark" size="sm" onClick={() => history.push(HOME)}>
            Home
          </Button>
          {!logged ? (
            <Button
              variant="dark"
              size="sm"
              onClick={() => history.push(LOGIN)}
            >
              Login
            </Button>
          ) : (
            <>
              <Button
                variant="dark"
                size="sm"
                onClick={() => history.push(PROFILE)}
              >
                Profile
              </Button>
              <Button
                variant="dark"
                size="sm"
                onClick={() => history.push(TRACKS)}
              >
                Tracks
              </Button>
              <Button variant="dark" size="sm" onClick={onClickLogout}>
                Logout
              </Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
