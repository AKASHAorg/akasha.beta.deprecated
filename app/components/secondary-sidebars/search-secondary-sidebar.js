import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ListItem, SvgIcon } from 'material-ui';
import { colors } from 'material-ui/styles';
import { searchQuery, searchHandshake, searchResetResults } from '../../local-flux/actions/search-actions';
import styles from './search-secondary-sidebar.scss';
import { MenuSearch } from '../svg';
import { SelectableList } from '../selectable-list';

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
        const { match, query } = this.props;
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

    componentWillUnmount () {
        this.props.searchResetResults();
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
            <button onClick={() => this.props.history.push(`/search/${this.props.match.params.topic}/${this.state.queryInput}`)}>Search</button>
            <div>{ this.props.handshakePending && 'Handshaking'} </div>
            <div>
              <SelectableList defaultValue={1}>
                <Link to="/search/entries">
                  <ListItem
                    value={1}
                    primaryText="Entries"
                  />
                </Link>
                <Link to="/search/people">
                  <ListItem
                    value={2}
                    primaryText="People"
                  />
                </Link>
                <Link to="/search/tags">
                  <ListItem
                    value={3}
                    primaryText="Tags"
                  />
                </Link>
                <Link to="/search/lists">
                  <ListItem
                    value={4}
                    primaryText="Lists"
                  />
                </Link>
              </SelectableList>
            </div>
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
    searchResetResults: PropTypes.func.isRequired,
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
        searchQuery,
        searchResetResults
    }
)(SearchSecondarySidebar);
