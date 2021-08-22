import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { HOME, LOGIN, PROFILE } from '../../statics/routes/routes.json';

const { Brand } = Navbar;
const { Link } = Nav;

const Header = () => (
  <Navbar bg="dark" variant="dark">
    <Container fluid>
      <Brand>Playlist Generator</Brand>
      <Nav className="me-auto">
        <Link href={HOME}>Home</Link>
        <Link href={LOGIN}>Login</Link>
        <Link href={PROFILE}>Profile</Link>
      </Nav>
    </Container>
  </Navbar>
);

export default Header;
