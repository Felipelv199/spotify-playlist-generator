/* eslint-disable implicit-arrow-linebreak */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { actionCreators } from '../../state';

interface DropdownFilterProps {
  genres: Array<string>;
  tracks: Array<any>;
  setPageNumber: any;
}

const { Item, Toggle, Menu } = Dropdown;

const CustomMenu = React.forwardRef((props: any, ref: any) => {
  const { children, style, className } = props;
  const [value, setValue] = useState('');
  return (
    <div
      ref={ref}
      style={{ ...style, padding: 5, maxHeight: 250, overflowY: 'scroll' }}
      className={className}
    >
      <FormControl
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <ul className="list-unstyled">
        {React.Children.toArray(children).filter(
          (child: any) =>
            !value || child.props.children.toLowerCase().startsWith(value),
        )}
      </ul>
    </div>
  );
});

const DropdownFilter = (dropdownFilterProps: DropdownFilterProps) => {
  const { genres, tracks, setPageNumber } = dropdownFilterProps;
  const dispatch = useDispatch();
  const { setPlaylistTracks, setPlaylistGenre } = bindActionCreators(
    actionCreators,
    dispatch,
  );
  const [toggleInnerHTML, setToggleInnerHTML] = useState('all');
  const [nTracks, setNTracks] = useState<number>(0);

  useEffect(() => {
    const handleGenrefilter = (genre: string) => {
      const filteredTracks = tracks.filter((track) => {
        const { album } = track;
        const { genres: albumGenres } = album;
        if (genre === '' || genre === 'all') {
          return true;
        }
        if (albumGenres.some((albumGenre: any) => albumGenre === genre)) {
          return true;
        }
        return false;
      });
      setPlaylistTracks(
        filteredTracks.map((track: any, index: number) => ({
          ...track,
          indexKey: index,
        })),
      );
      setPlaylistGenre(genre);
      setNTracks(filteredTracks.length);
    };
    handleGenrefilter(toggleInnerHTML);
  }, [toggleInnerHTML, tracks, setPlaylistTracks, setPlaylistGenre]);

  const dropdownOnClick = (event: any) => {
    const { target } = event;
    setToggleInnerHTML(target.innerHTML);
    setPageNumber(1);
  };

  return (
    <Stack direction="horizontal" gap={3}>
      <span>Filter by genre:</span>
      <Dropdown as={ButtonGroup}>
        <Button variant="dark">{toggleInnerHTML}</Button>
        <Toggle variant="dark" />
        <Menu as={CustomMenu}>
          {genres.map((genre, index) => (
            <Item
              key={`${index.toString()}`}
              eventKey={index.toString()}
              onClick={dropdownOnClick}
            >
              {genre}
            </Item>
          ))}
        </Menu>
      </Dropdown>
      <span>{`Total tracks: ${nTracks}`}</span>
    </Stack>
  );
};

export default DropdownFilter;
