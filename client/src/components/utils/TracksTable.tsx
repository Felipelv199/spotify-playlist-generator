import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { State } from '../../state';
import tableHeaders from '../../statics/pages/tracks/tableHeaders.json';
import DisplayTracksStack from '../tracks/DisplayTracksStack';

interface TracksTableProps {
  pageNumber: number;
  setPageNumber: any;
}

const TracksTable = (props: TracksTableProps) => {
  const { pageNumber, setPageNumber } = props;
  const [nTracks, setNTracks] = useState<number>(0);
  const [bounds, setBounds] = useState<Array<number>>([0, 10]);
  const [listTracks, setListTracks] = useState<Array<any>>();
  const [limit, setLimit] = useState(10);
  const [pagesN, setPagesN] = useState(0);
  const playlistState = useSelector((state: State) => state.playlist);
  const { tracks } = playlistState;

  const parseTracks = (track: any) => {
    const { album, name, indexKey: key } = track;
    const { artists, images } = album;
    const artistsNames = artists.map((artist: any) => artist.name);
    const trackNumber = key + 1;
    const image = images[0];
    const { url } = image;
    return (
      <tr key={key.toString()}>
        <td>
          <img src={url} alt="albumImg" width="25px" />
        </td>
        <td>{trackNumber.toString()}</td>
        <td>{name}</td>
        <td>{album.name}</td>
        <td>{artistsNames.join(', ')}</td>
      </tr>
    );
  };

  useEffect(() => {
    if (tracks.length !== nTracks) {
      setNTracks(tracks.length);
    }
    if (pageNumber === 1) {
      setListTracks(tracks.slice(0, limit));
    } else {
      setListTracks(tracks.slice(bounds[0], bounds[1]));
    }
    setPagesN(Math.ceil(nTracks / limit));
  }, [tracks, nTracks, bounds, pageNumber, limit]);

  return (
    <>
      <DisplayTracksStack
        setPageNumber={setPageNumber}
        setBounds={setBounds}
        setLimit={setLimit}
        pagesN={pagesN}
        limit={limit}
        pageNumber={pageNumber}
      />
      <Table striped variant="dark" className="mb-1">
        <thead>
          <tr>
            {tableHeaders.map((header, index) => (
              <th key={index.toString()}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{listTracks?.map((track) => parseTracks(track))}</tbody>
      </Table>
      <DisplayTracksStack
        setPageNumber={setPageNumber}
        setBounds={setBounds}
        setLimit={setLimit}
        pagesN={pagesN}
        limit={limit}
        pageNumber={pageNumber}
      />
    </>
  );
};

export default TracksTable;
