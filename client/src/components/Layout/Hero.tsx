import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Hero = () => (
  <div
    style={{ minHeight: 'calc(100vh - 56px)', display: 'flex' }}
    className="align-items-center"
  >
    <Container>
      <Row className="justify-content-center">
        <Col xs="auto">
          <h1>Playlist Generator</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs="auto">
          <h5>We help you organise your saved tracks in Spotify</h5>
        </Col>
      </Row>
    </Container>
  </div>
);

export default Hero;
