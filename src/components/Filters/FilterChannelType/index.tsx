import { CONSTANT_CHANNEL_FILTER } from "constants/filter-channel";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "semantic-ui-react";
import { styled } from "utils/styled-component";

function FilterChannelType() {
  // STO: 3,
  // ORG: 4,
  // PER: 5,
  // SPL: 6,
  const dispatch: any = useDispatch();
  const filterChannelType = useSelector(
    ({ channel }) => channel.filterChannelType
  );

  const handleChangeFilter = (number: number) => {
    console.log("number", number);
    dispatch({
      type: "FILTER_CHANNEL_TYPE_SUCCESS",
      number,
    });
  };
  // console.log("filterChannelType", filterChannelType);
  return (
    <FilterChannelTypeStyled>
      <button
        // con÷tent="All"
        onClick={() => handleChangeFilter(CONSTANT_CHANNEL_FILTER.ALL)}
        style={{
          backgroundColor: filterChannelType === 1 ? "#6474d6" : "",
          color: filterChannelType === 1 ? "#fff" : "#000",
        }}
      >
        All
      </button>
      <button
        onClick={() => handleChangeFilter(CONSTANT_CHANNEL_FILTER.PER)}
        style={{
          backgroundColor: filterChannelType === 5 ? "#6474d6" : "",
          color: filterChannelType === 5 ? "#fff" : "#000",
        }}
      >
        Personal
      </button>
      <button
        onClick={() => handleChangeFilter(CONSTANT_CHANNEL_FILTER.ORG)}
        style={{
          backgroundColor: filterChannelType === 4 ? "#6474d6" : "",
          color: filterChannelType === 4 ? "#fff" : "#000",
        }}
      >
        Organizatio
      </button>
      <button
        onClick={() => handleChangeFilter(CONSTANT_CHANNEL_FILTER.SPL)}
        style={{
          backgroundColor: filterChannelType === 6 ? "#6474d6" : "",
          color: filterChannelType === 6 ? "#fff" : "#000",
        }}
      >
        Speciallist
      </button>
    </FilterChannelTypeStyled>
  );
}

const FilterChannelTypeStyled = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;

  button {
    background: none;
    border: none;
    width: 100%;
    margin-right: 0 !important;
    border-radius: 20px !important;
    font-size: 12px !important;
    padding: 3px 12px !important;
    &:first-child {
      border-right: 1px solid #fff;
    }
    &:focus,
    &:focus-visible {
        outline: none;
        border:none;
    }
  }
`;

export default FilterChannelType;
