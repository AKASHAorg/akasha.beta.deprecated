import React, { PropTypes } from 'react';
import { SvgIcon } from 'material-ui';
import { MenuSearch } from './svg';

const SearchInput = ({ onChange, onSubmit, value }, { muiTheme }) => (
  <div
    style={{
        display: 'flex',
        alignItems: 'center',
        height: '48px',
        width: '100%',
        border: `1px solid ${muiTheme.palette.borderColor}`
    }}
  >
    <SvgIcon
      style={{ flex: '0 0 auto', height: '42px', width: '42px' }}
      viewBox="0 0 32 32"
    >
      <MenuSearch />
    </SvgIcon>
    <form onSubmit={(ev) => { ev.preventDefault(); onSubmit(); }}>
      <input
        autoFocus // eslint-disable-line jsx-a11y/no-autofocus
        onChange={ev => onChange(ev.target.value)}
        style={{
            flex: '1 1 auto',
            fontSize: '18px',
            border: 'none',
            outline: 'none',
            height: '24px',
            lineHeight: '24px'
        }}
        type="text"
        value={value}
      />
    </form>
  </div>
);

SearchInput.contextTypes = {
    muiTheme: PropTypes.shape()
};

SearchInput.propTypes = {
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    value: PropTypes.string,
};

export default SearchInput;
