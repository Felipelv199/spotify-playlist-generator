import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { actionCreators, State } from '../../state';
import { SPOTIFY_PLAYLIST } from '../../statics/routes/server.json';
import appError from '../../utils/appError';

interface CreatePlaylistModalProps {
  setErrorMessage: any;
  setDisplayAlert: any;
}

interface Playlist {
  name: string;
  description: string;
  public: boolean;
}

const playlistInitalState: Playlist = {
  name: '',
  description: '',
  public: false,
};

const CreatePlaylistForm = (props: CreatePlaylistModalProps) => {
  const { setErrorMessage, setDisplayAlert } = props;
  const [showModal, setShowModal] = useState<boolean>(false);
  const [playlist, setPlaylist] = useState<Playlist>(playlistInitalState);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const playlistState = useSelector((state: State) => state.playlist);
  const { tracks } = playlistState;
  const profile = useSelector((state: State) => state.profile);
  const token = useSelector((state: State) => state.auth);
  const dispatch = useDispatch();
  const { logout, removeProfile } = bindActionCreators(
    actionCreators,
    dispatch,
  );

  const resetPlaylist = () => {
    setPlaylist(playlistInitalState);
  };

  const closeModal = () => {
    setShowModal(false);
    resetPlaylist();
    setValidated(false);
  };

  const onClickButton = (event: any) => {
    event.preventDefault();
    setShowModal(true);
  };

  const onCloseButton = () => {
    closeModal();
  };

  const validatePlaylistFields = () => {
    if (playlist.description === '') {
      return true;
    }
    if (playlist.name === '') {
      return true;
    }
    return false;
  };

  const createRequestData = () => {
    const requestTracks = tracks.map((track) => track.id);
    return {
      clientId: profile.clientId,
      token,
      playlist,
      tracks: requestTracks,
    };
  };

  const uploadPlaylist = async (request: any) => {
    try {
      await axios.post(SPOTIFY_PLAYLIST, request);
      setDisplayAlert(false);
    } catch (error) {
      if (appError.isUnauthorized(error)) {
        logout();
        removeProfile();
      }
      setErrorMessage(appError.onError(error));
      setDisplayAlert(true);
    }
  };

  const onClickModalButton = async (event: any) => {
    event.preventDefault();
    if (validatePlaylistFields()) {
      setValidated(true);
      return;
    }
    setIsLoading(true);
    const request = createRequestData();
    uploadPlaylist(request);
    closeModal();
    setIsLoading(false);
  };

  const onChangeForm = (event: any) => {
    const { target } = event;
    const { value, id } = target;
    setPlaylist({
      ...playlist,
      [id]: value,
    });
  };

  return (
    <>
      <Button variant="dark" onClick={onClickButton}>
        Create Playlist
      </Button>
      <Modal show={showModal}>
        {!isLoading ? (
          <>
            <Modal.Header closeButton onClick={onCloseButton}>
              <Modal.Title>Playlist</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form noValidate validated={validated}>
                <Form.Group
                  className="mb-3"
                  controlId="name"
                  onChange={onChangeForm}
                >
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={`Enter playlist name. Ej. ${playlistState.genre}`}
                    required
                  />
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="description"
                  onChange={onChangeForm}
                >
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Enter playlist description"
                    required
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onCloseButton}>
                Close
              </Button>
              <Button variant="dark" onClick={onClickModalButton}>
                Create Playlist
              </Button>
            </Modal.Footer>
          </>
        ) : (
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
        )}
      </Modal>
    </>
  );
};

export default CreatePlaylistForm;
