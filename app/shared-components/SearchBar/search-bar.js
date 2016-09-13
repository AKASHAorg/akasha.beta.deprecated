import React from 'react';
import { TextField, SvgIcon, IconButton } from 'material-ui';
import SearchIcon from 'material-ui/svg-icons/action/search';

export default function SearchBar (props) {
    return (
      <div style={props.style}>
        <SvgIcon style={props.searchIconStyle}>
          <SearchIcon />
        </SvgIcon>
        <TextField
          hintText={props.hintText}
          onChange={props.onChange}
          value={props.value}
          inputStyle={{ paddingLeft: '24px', paddingRight: '34px' }}
          hintStyle={{ paddingLeft: '24px' }}
          fullWidth={props.fullWidth}
          style={{ width: '90%' }}
        />
        {props.showCancelButton &&
          <IconButton
            iconClassName="material-icons"
            style={{
                marginLeft: '-34px',
                paddingBottom: 0,
                paddingTop: 0,
                verticalAlign: 'middle'
            }}
          >
            close
          </IconButton>
        }
      </div>
    );
}
SearchBar.propTypes = {
    style: React.PropTypes.object,
    hintText: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    showCancelButton: React.PropTypes.bool,
    value: React.PropTypes.string.isRequired,
    searchIconStyle: React.PropTypes.object,
    fullWidth: React.PropTypes.bool
};
