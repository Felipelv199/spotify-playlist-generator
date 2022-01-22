import React from 'react';
import { Button, Dropdown, DropdownButton, Stack } from 'react-bootstrap';

interface DisplayTracksStackProps {
  setPageNumber: any;
  pageNumber: number;
  setLimit: any;
  limit: number;
  setBounds: any;
  pagesN: number;
}

const DisplayTracksStack = (props: DisplayTracksStackProps) => {
  const { setPageNumber, pageNumber, setLimit, limit, setBounds, pagesN } =
    props;

  const changePage = (direction: number) => {
    const newPageNumber = pageNumber + direction;
    if (newPageNumber >= 1 && newPageNumber <= pagesN) {
      const upperBound = newPageNumber * limit;
      const lowerBound = upperBound - limit;
      setBounds([lowerBound, upperBound]);
      setPageNumber(pageNumber + direction);
    }
  };

  const dropdownOnClick = (event: any) => {
    event.preventDefault();
    const { target } = event;
    const newLimit = Number(target.innerHTML);
    setLimit(newLimit);
    setBounds([0, newLimit]);
    setPageNumber(1);
  };

  return (
    <Stack gap={3} direction="horizontal" className="mb-1">
      <Button onClick={() => changePage(-1)} variant="dark">
        {'<'}
      </Button>
      <span>{`${pageNumber} of ${pagesN}`}</span>
      <Button onClick={() => changePage(1)} variant="dark">
        {'>'}
      </Button>
      <DropdownButton id="dropdown-basic-button" title={limit} variant="dark">
        {[10, 25, 50, 100].map((number) => (
          <Dropdown.Item key={number.toString()} onClick={dropdownOnClick}>
            {number}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </Stack>
  );
};

export default DisplayTracksStack;
