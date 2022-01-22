import React, { useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { SPOTIFY_LIBRARY_TRACKS } from '../statics/routes/server.json';
import { State, actionCreators } from '../state';
import DropdownFilter from '../components/utils/DropdownFilter';
import MessageSpinner from '../components/utils/MessageSpinner';
import CreatePlaylistForm from '../components/utils/CreatePlaylistForm';
import appError from '../utils/appError';
import TracksTable from '../components/utils/TracksTable';

const Tracks = () => {
  const dispatch = useDispatch();
  const [tracks, setTracks] = useState<Array<any>>();
  const [genres, setGenres] = useState<Array<string>>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [displayAlert, setDisplayAlert] = useState(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const token = useSelector((state: State) => state.auth);
  const { logout } = bindActionCreators(actionCreators, dispatch);

  const getTracks = useCallback(async () => {
    try {
      const response = await axios.get(SPOTIFY_LIBRARY_TRACKS, {
        params: { code: token },
      });
      const { data } = response;
      setTracks(data.tracks);
      const newGenres: Array<string> = [];
      data.tracks.forEach((track: any) => {
        const { album } = track;
        album.genres.forEach((genre: any) => {
          if (!newGenres.some((g) => g === genre)) {
            newGenres.push(genre);
          }
        });
      });
      newGenres.push('all');
      newGenres.sort();
      setGenres(newGenres);
    } catch (error) {
      if (appError.isUnauthorized(error)) {
        logout();
      }
      setErrorMessage(appError.onError(error));
      setDisplayAlert(true);
    }
  }, [token, logout]);

  useEffect(() => {
    if (!tracks) {
      getTracks();
    }
  }, [getTracks, tracks]);

  if (!tracks) {
    return (
      <Container>
        <Alert
          variant="danger"
          onClose={() => setDisplayAlert(false)}
          show={displayAlert}
          dismissible
        >
          {errorMessage}
        </Alert>
        {!displayAlert && <MessageSpinner message="loading" />}
      </Container>
    );
  }

  return (
    <Container className="mb-3">
      <Alert
        variant="danger"
        onClose={() => setDisplayAlert(false)}
        show={displayAlert}
        dismissible
      >
        {errorMessage}
      </Alert>
      <h1>Tracks</h1>
      <Row className="mb-3">
        <Col>
          <DropdownFilter
            genres={genres}
            tracks={tracks}
            setPageNumber={setPageNumber}
          />
        </Col>
        <Col xs="auto">
          <CreatePlaylistForm
            setErrorMessage={setErrorMessage}
            setDisplayAlert={setDisplayAlert}
          />
        </Col>
      </Row>
      <TracksTable pageNumber={pageNumber} setPageNumber={setPageNumber} />
    </Container>
  );
};

export default Tracks;
