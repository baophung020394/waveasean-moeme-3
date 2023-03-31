import { CONSTANT_CHANNEL_FILTER } from "constants/filter-channel";
import React from "react";
import { useDispatch } from "react-redux";
import { Button } from "semantic-ui-react";
import { styled } from "utils/styled-component";

interface FilterChannels {}

function FilterChannels() {
  const dispatch: any = useDispatch();

  const handleChangeFilter = (number: number) => {
    dispatch({
      type: "FILTER_CHANNEL_SUCCESS",
      number,
    });
  };

  return (
    <FilterChannelsStyled className="filter-channels">
      <Button content="All channels" onClick={() => handleChangeFilter(CONSTANT_CHANNEL_FILTER.ALL)} />
      <Button content="My channels" onClick={() => handleChangeFilter(CONSTANT_CHANNEL_FILTER.MY_CHANNEL)} />
    </FilterChannelsStyled>
  );
}

const FilterChannelsStyled = styled.div`
  display: flex;
  justify-content: space-between;

  button {
    width: 100%;
    margin-right: 0 !important;
    border-radius: 0 !important;

    &:first-child {
      border-right: 1px solid #fff;
    }
  }
`;

export default FilterChannels;
