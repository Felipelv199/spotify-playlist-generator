/* eslint-disable implicit-arrow-linebreak */
import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';

interface DropdownFilterProps {
  genres: Array<string>;
  toggleInnerHTML: string;
  setToggleInnerHTML: React.Dispatch<React.SetStateAction<string>>;
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
  const { genres, toggleInnerHTML, setToggleInnerHTML } = dropdownFilterProps;

  return (
    <Dropdown>
      <Toggle variant="dark">
        {toggleInnerHTML === '' ? 'genres' : toggleInnerHTML}
      </Toggle>
      <Menu as={CustomMenu}>
        {genres.map((genre, index) => (
          <Item
            key={index.toString()}
            eventKey={index.toString()}
            onClick={(e: any) => {
              const { target } = e;
              setToggleInnerHTML(target.innerHTML);
            }}
          >
            {genre}
          </Item>
        ))}
      </Menu>
    </Dropdown>
  );
};

export default DropdownFilter;
