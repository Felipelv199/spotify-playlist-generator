import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { actionCreators, State } from '../../state';
import { SPOTIFY_PLAYLIST } from '../../statics/routes/server.json';
import appError from '../../utils/appError';

const { Control } = Form;

interface CreatePlaylistModalProps {
  tracks: Array<any>;
  toggleInnerHTML: string;
  setErrorMessage: any;
  setDisplayAlert: any;
}

const CreatePlaylistModal = (
  createPlaylistModalProps: CreatePlaylistModalProps,
) => {
  const { tracks, toggleInnerHTML, setDisplayAlert, setErrorMessage } =
    createPlaylistModalProps;
  const [playlistTracks, setPlaylistTracks] = useState<Array<any>>([]);
  const [show, setShow] = useState(false);
  const [playlist, setPlaylist] = useState({
    description: '',
    name: '',
    public: false,
  });
  const [validated, setValidated] = useState(false);
  const profile = useSelector((state: State) => state.profile);
  const token = useSelector((state: State) => state.auth);
  const dispatch = useDispatch();
  const { logout } = bindActionCreators(actionCreators, dispatch);

  const createRequestData = () => {
    let requestTracks = playlistTracks;
    if (requestTracks.length === 0) {
      requestTracks = tracks;
    }
    requestTracks = requestTracks.map((track) => track.id);
    return {
      clientId: profile.clientId,
      token,
      playlist,
      tracks: requestTracks,
    };
  };

  const resetFields = () => {
    setPlaylist({ ...playlist, description: '', name: '' });
  };

  const handleClick = async (event: any) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
    } else {
      setShow(true);
      const request = createRequestData();
      try {
        await axios.post(SPOTIFY_PLAYLIST, request);
        setDisplayAlert(false);
      } catch (error) {
        if (appError.isUnauthorized(error)) {
          logout();
        }
        setErrorMessage(appError.onError(error));
        setDisplayAlert(true);
      }
      form.reset();
      setShow(false);
      resetFields();
      setValidated(false);
    }
  };

  useEffect(() => {
    if (toggleInnerHTML !== '' && tracks !== undefined) {
      const filteredTracks: any[] = tracks.filter((track: any) =>
        track.album.genres.some((genre: any) => genre === toggleInnerHTML),
      );
      setPlaylistTracks(filteredTracks);
    }
  }, [tracks, toggleInnerHTML]);

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleClick}>
        <Row className="mb-3">
          <Col>
            <Control
              type="text"
              placeholder="Enter playlist name"
              required
              onChange={(event: any) =>
                setPlaylist({
                  ...playlist,
                  name: event.target.value,
                })
              }
            />
          </Col>
          <Col>
            <Control
              as="textarea"
              placeholder="Enter playlist description"
              required
              onChange={(event: any) =>
                setPlaylist({
                  ...playlist,
                  description: event.target.value,
                })
              }
            />
          </Col>
        </Row>
        <Row style={{ justifyContent: 'end' }}>
          <Col xs="auto">
            <Button variant="dark" type="submit">
              Create Playlist
            </Button>
          </Col>
        </Row>
      </Form>
      <Modal show={show}>
        <Modal.Body>
          <Row className="justify-content-center">
            <Col xs="auto">
              <Spinner animation="border" role="status" />
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs="auto">
              <span>Creating playlist</span>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreatePlaylistModal;
