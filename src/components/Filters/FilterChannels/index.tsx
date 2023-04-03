import { CONSTANT_CHANNEL_FILTER } from "constants/filter-channel";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "semantic-ui-react";
import { styled } from "utils/styled-component";

interface FilterChannels {}

function FilterChannels() {
  const dispatch: any = useDispatch();
  const filterChannels = useSelector(({ channel }) => channel.filterChannels);

  const handleChangeFilter = (number: number) => {
    dispatch({
      type: "FILTER_CHANNEL_SUCCESS",
      number,
    });
  };

  return (
    <FilterChannelsStyled className="filter-channels">
      {/* <button className="before">beforene</button> */}
      <Button
        className={`${filterChannels === 1 ? "active" : ""}`}
        onClick={() => handleChangeFilter(CONSTANT_CHANNEL_FILTER.ALL)}
      >
        All channels
        {filterChannels === 1 && <span className="white-dot"></span>}
      </Button>
      <Button
        className={`${filterChannels === 2 ? "active" : ""}`}
        onClick={() => handleChangeFilter(CONSTANT_CHANNEL_FILTER.MY_CHANNEL)}
      >
        My channels
        {filterChannels === 2 && <span className="white-dot"></span>}
      </Button>
    </FilterChannelsStyled>
  );
}

const FilterChannelsStyled = styled.div`
  display: flex;
  justify-content: space-between;

  button {
    width: 100%;
    min-height: 50px;
    margin-right: 0 !important;
    border-radius: 0 !important;
    background: none;
    border: none;
    position: relative;
    background: none !important;
    border: none !important;

    .white-dot {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 3px;
      height: 3px;
      border-radiux: 50%;
      background: #6474d6;
    }

    &:first-child {
      border-right: 1px solid #fff;
    }
  }
`;

export default FilterChannels;
