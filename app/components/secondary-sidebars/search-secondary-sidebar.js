import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { searchQuery, searchHandshake, searchResetResults } from '../../local-flux/actions/search-actions';
import { tagSearch } from '../../local-flux/actions/tag-actions';
import { MenuSearch } from '../svg';
import { SelectableList } from '../';

const topics = ['entries', 'people', 'tags', 'lists'];

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
            switch (match.params.topic) {
                case topics[0]:
                    this.props.searchQuery(match.params.query);
                    break;
                case topics[2]:
                    this.props.tagSearch(match.params.query);
                    break;
                default:
                    break;
            }
        }
    }

    componentWillReceiveProps (nextProps) {
        const { match } = this.props;
        const nextQuery = nextProps.match.params.query;
        const nextTopic = nextProps.match.params.topic;
        if (!nextQuery) {
            this.props.searchResetResults();
            this.setState({ queryInput: '' });
        } else if (nextQuery !== match.params.query || nextTopic !== match.params.topic) {
            this.setState({ queryInput: nextQuery });
            switch (nextTopic) {
                case topics[0]:
                    this.props.searchQuery(nextQuery);
                    break;
                case topics[2]:
                    this.props.tagSearch(nextQuery);
                    break;
                default:
                    break;
            }
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
            <div className="search-secondary-sidebar__search">
              <svg viewBox="0 0 32 32">
                <MenuSearch />
              </svg>
              <input
                type="text"
                className="search-secondary-sidebar__input"
                value={this.state.queryInput}
                onChange={this.handleChange}
                placeholder="Search something..."
              />
            </div>
            { this.props.handshakePending ||
                 this.props.searchService ?
                    null :
                    <button onClick={() => this.props.searchHandshake()}>Handshake</button>
            }
            <button
              onClick={() =>
                this.props.history.push(`/search/${this.props.match.params.topic}/${this.state.queryInput}`)
              }
            >
              Search
            </button>
            <div>{ this.props.handshakePending && 'Handshaking'} </div>
            <div>
              <SelectableList defaultValue={topics.indexOf(this.props.match.params.topic)}>
                {/* <ListItem
                  value={0}
                  primaryText="Entries"
                  containerElement={<Link to={`/search/${topics[0]}/${this.state.queryInput}`} />}
                />
                <ListItem
                  value={1}
                  primaryText="People"
                  containerElement={<Link to={`/search/${topics[1]}/${this.state.queryInput}`} />}
                />
                <ListItem
                  value={2}
                  primaryText="Tags"
                  containerElement={<Link to={`/search/${topics[2]}/${this.state.queryInput}`} />}
                />
                <ListItem
                  value={3}
                  primaryText="Lists"
                  containerElement={<Link to={`/search/${topics[3]}/${this.state.queryInput}`} />}
                /> */}
              </SelectableList>
            </div>
          </div>
        );
    }
}

SearchSecondarySidebar.propTypes = {
    handshakePending: PropTypes.bool,
    searchHandshake: PropTypes.func.isRequired,
    match: PropTypes.shape(),
    query: PropTypes.string,
    history: PropTypes.shape(),
    searchQuery: PropTypes.func.isRequired,
    searchResetResults: PropTypes.func.isRequired,
    searchService: PropTypes.bool,
    tagSearch: PropTypes.func
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
        searchResetResults,
        tagSearch
    }
)(SearchSecondarySidebar);
