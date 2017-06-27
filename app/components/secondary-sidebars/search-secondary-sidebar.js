import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { searchQuery, searchHandshake } from '../../local-flux/actions/search-actions';

let queryInput;

const SearchSecondarySidebar = props => (
  <div>
  Search:
    <input ref={el => (queryInput = el)} />
    <button onClick={() => props.searchHandshake()}>Handshake</button>
    <button onClick={() => props.searchQuery(queryInput.value)}>Search</button>
    <div>{ props.handshakePending && 'Handshaking'} </div>
  </div>
);

SearchSecondarySidebar.contextTypes = {
    muiTheme: PropTypes.shape()
};

SearchSecondarySidebar.propTypes = {
    handshakePending: PropTypes.bool,
    searchHandshake: PropTypes.func.isRequired,
    searchQuery: PropTypes.func.isRequired
};

function mapStateToProps (state) {
    return {
        handshakePending: state.searchState.getIn(['flags', 'handshakePending'])
    };
}

export default connect(
    mapStateToProps,
    {
        searchHandshake,
        searchQuery
    }
)(SearchSecondarySidebar);
