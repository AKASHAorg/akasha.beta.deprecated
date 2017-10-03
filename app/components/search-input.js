import PropTypes from 'prop-types';
import React from 'react';
import { MenuSearch } from './svg';

const SearchInput = ({ onChange, onSubmit, value }) => (
  <div className="flex-center-y search-input">
    <svg
      className="search-input__icon"
      viewBox="0 0 32 32"
    >
      <MenuSearch />
    </svg>
    <form onSubmit={(ev) => { ev.preventDefault(); onSubmit(); }}>
      <input
        autoFocus // eslint-disable-line jsx-a11y/no-autofocus
        className="search-input__input"
        onChange={ev => onChange(ev.target.value)}
        type="text"
        value={value}
      />
    </form>
  </div>
);

SearchInput.propTypes = {
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    value: PropTypes.string,
};

export default SearchInput;
