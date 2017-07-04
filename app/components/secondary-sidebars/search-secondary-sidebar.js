import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SvgIcon } from 'material-ui';
import { colors } from 'material-ui/styles';
import { searchQuery, searchHandshake } from '../../local-flux/actions/search-actions';
import styles from './search-secondary-sidebar.scss';
import { MenuSearch } from '../../shared-components/svg';

class SearchSecondarySidebar extends Component {
    constructor (props) {
        super(props);
        if (props.match.params.query) {
            this.state = { queryInput: props.match.params.query };
        } else {
            this.state = { queryInput: props.query };
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount () {
        const { match, searchService, query } = this.props;
        if (!searchService) { this.props.searchHandshake(); }
        if (!query && match.params.query) {
            this.props.searchQuery(match.params.query);
        }
    }

    componentWillReceiveProps (nextProps) {
        const { match } = this.props;
        if (nextProps.match.params.query !== match.params.query) {
            this.props.searchQuery(nextProps.match.params.query);
            this.setState({ queryInput: nextProps.match.params.query });
        }
    }

    handleChange = (event) => {
        this.setState({ queryInput: event.target.value });
    }

    render () {
        return (
          <div>
            <div>
              Search
            </div>
            <div className={styles.search}>
              <SvgIcon
                color={colors.lightBlack}
                hoverColor={colors.darkBlack}
                viewBox="0 0 32 32"
              >
                <MenuSearch />
              </SvgIcon>
              <input type="text" className={styles.input} value={this.state.queryInput} onChange={this.handleChange} placeholder="Search something..." />
            </div>
            { this.props.handshakePending || this.props.searchService ? null : <button onClick={() => this.props.searchHandshake()}>Handshake</button> }
            <button onClick={() => this.props.history.push(`/search/${this.state.queryInput}`)}>Search</button>
            <div>{ this.props.handshakePending && 'Handshaking'} </div>
          </div>
        );
    }
}

SearchSecondarySidebar.contextTypes = {
    muiTheme: PropTypes.shape()
};

SearchSecondarySidebar.propTypes = {
    handshakePending: PropTypes.bool,
    searchHandshake: PropTypes.func.isRequired,
    searchQuery: PropTypes.func.isRequired,
    searchService: PropTypes.bool,
    match: PropTypes.shape(),
    query: PropTypes.string,
    history: PropTypes.shape()
};

function mapStateToProps (state) {
    return {
        handshakePending: state.searchState.getIn(['flags', 'handshakePending']),
        searchService: state.searchState.get('searchService'),
        query: state.searchState.get('query')
    };
}

export default connect(
    mapStateToProps,
    {
        searchHandshake,
        searchQuery
    }
)(SearchSecondarySidebar);
