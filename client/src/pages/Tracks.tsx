/* eslint-disable operator-linebreak */
import React, { useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { SPOTIFY_LIBRARY_TRACKS } from '../statics/routes/server.json';
import { State, actionCreators } from '../state';
import tableHeaders from '../statics/pages/tracks/tableHeaders.json';
import DropdownFilter from '../components/utils/DropdownFilter';
import MessageSpinner from '../components/utils/MessageSpinner';
import CreatePlaylistForm from '../components/utils/CreatePlaylistForm';
import appError from '../utils/appError';

const Tracks = () => {
  const dispatch = useDispatch();
  const [tracks, setTracks] = useState<Array<any>>();
  const [genres, setGenres] = useState<Array<string>>([]);
  const [toggleInnerHTML, setToggleInnerHTML] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [displayAlert, setDisplayAlert] = useState(false);
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

  const parseTracks = (track: any, key: number) => {
    const { album, name } = track;
    const { artists, images, genres: albumGenres } = album;
    const artistsNames = artists.map((artist: any) => artist.name);
    const trackNumber = key + 1;
    const image = images[0];
    const { url } = image;
    if (
      albumGenres.some((genre: any) => genre === toggleInnerHTML) ||
      toggleInnerHTML === '' ||
      toggleInnerHTML === 'all'
    ) {
      return (
        <tr key={key.toString()}>
          <td>
            <img src={url} alt="albumImg" width="50px" />
          </td>
          <td>{trackNumber.toString()}</td>
          <td>{name}</td>
          <td>{album.name}</td>
          <td>{artistsNames.join(', ')}</td>
        </tr>
      );
    }
    return null;
  };

  useEffect(() => {
    if (!tracks) {
      getTracks();
    }
  }, [getTracks, tracks, toggleInnerHTML]);

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
    <Container>
      <Alert
        variant="danger"
        onClose={() => setDisplayAlert(false)}
        show={displayAlert}
        dismissible
      >
        {errorMessage}
      </Alert>
      <h1>Tracks</h1>
      <Row>
        <Col className="justify-content-end">
          <DropdownFilter
            genres={genres}
            toggleInnerHTML={toggleInnerHTML}
            setToggleInnerHTML={setToggleInnerHTML}
          />
        </Col>
        <Col className="justify-content-end">
          <CreatePlaylistForm
            tracks={tracks}
            toggleInnerHTML={toggleInnerHTML}
            setErrorMessage={setErrorMessage}
            setDisplayAlert={setDisplayAlert}
          />
        </Col>
      </Row>
      <Table>
        <thead>
          <tr>
            {tableHeaders.map((header, index) => (
              <th key={index.toString()}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tracks?.map((track, index) => parseTracks(track, index))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Tracks;
