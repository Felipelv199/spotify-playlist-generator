import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

interface MessageSpinnerPops {
  message: string;
}

const MessageSpinner = (props: MessageSpinnerPops) => {
  const { message } = props;
  return (
    <Container
      style={{
        minHeight: 'calc(100vh - 56px)',
        alignContent: 'center',
        position: 'absolute',
        display: 'grid',
      }}
    >
      <Row className="justify-content-center">
        <Col xs="auto">
          <Spinner animation="border" role="status" />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs="auto">
          <span>{message}</span>
        </Col>
      </Row>
    </Container>
  );
};

export default MessageSpinner;
