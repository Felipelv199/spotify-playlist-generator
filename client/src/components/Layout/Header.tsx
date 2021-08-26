import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import {
  HOME,
  LOGIN,
  PROFILE,
  DASHBOARD,
} from '../../statics/routes/routes.json';
import { State } from '../../state';

const { Brand } = Navbar;

const Header = () => {
  const history = useHistory();
  const [logged, setLogged] = useState(false);
  const auth = useSelector((state: State) => state.auth);

  useEffect(() => {
    if (!auth) {
      setLogged(false);
    } else {
      setLogged(true);
    }
  }, [auth]);

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
                onClick={() => history.push(DASHBOARD)}
              >
                Dashboard
              </Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
