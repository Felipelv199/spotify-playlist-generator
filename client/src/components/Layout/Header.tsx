import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

const { Brand } = Navbar;
const { Link } = Nav;

const Header = () => (
  <Navbar bg="dark" variant="dark">
    <Container fluid>
      <Brand>Playlist Generator</Brand>
      <Nav className="me-auto">
        <Link href="/">Home</Link>
        <Link href="/login">Login</Link>
        <Link href="/profile">Profile</Link>
      </Nav>
    </Container>
  </Navbar>
);

export default Header;
