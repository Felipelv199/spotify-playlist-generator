import React from 'react';
import { useHistory } from 'react-router';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { HOME } from '../statics/routes/routes.json';

const { Body } = Card;

const NotFound = () => {
  const history = useHistory();
  return (
    <Container
      style={{
        minHeight: 'calc(100vh - 56px)',
        alignItems: 'center',
        display: 'grid',
        justifyContent: 'center',
      }}
    >
      <Card bg="dark" border="dark" text="secondary" className="text-center">
        <Body style={{ marginLeft: 175, marginRight: 175 }}>
          <h1 style={{ fontSize: 175 }}>404</h1>
          <h2>Page not found</h2>
          <Button
            size="lg"
            onClick={() => history.push(HOME)}
            style={{ marginTop: 75, marginBottom: 25 }}
          >
            Go back home
          </Button>
        </Body>
      </Card>
    </Container>
  );
};

export default NotFound;
