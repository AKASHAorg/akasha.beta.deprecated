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
        this.state = { queryInput: this.props.query };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount () {
        const { query, match, history } = this.props;
        if (query) {
            history.push(`/search/${query}`);
        }
        if (match.params.query) {
            this.setState({ queryInput: match.params.query });
        }
    }

    componentDidMount () {
        const { match, searchService } = this.props;
        if (!searchService) { this.props.searchHandshake(); }
        if (match.params.query) {
            this.props.searchQuery(match.params.query);
        }
    }

    componentDidUpdate (prevProps) {
        const { query, history, match } = this.props;
        if (prevProps.query !== query && match.params.query !== query) {
            history.push(`/search/${query}`);
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
            <button onClick={() => this.props.searchQuery(this.state.queryInput)}>Search</button>
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
