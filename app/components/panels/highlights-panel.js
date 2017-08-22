import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input } from 'antd';
import { HighlightCard, ProfilePanelsHeader } from '../';
import { highlightDelete, highlightSearch } from '../../local-flux/actions/highlight-actions';
import { profileGetList } from '../../local-flux/actions/profile-actions';
import { selectHighlights, selectHighlightSearch } from '../../local-flux/selectors';

const { Search } = Input;

class HighlightsPanel extends Component {
    componentDidMount () {
        const { highlights } = this.props;
        const akashaIds = highlights.map(highlight => highlight.get('publisher'));
        // this.props.profileGetList(akashaIds);
    }

    shouldComponentUpdate (nextProps) {
        const { highlights, search } = this.props;
        return !highlights.equals(nextProps.highlights) || search !== nextProps.search;
    }

    onSearchChange = (ev) => {
        this.props.highlightSearch(ev.target.value);
    };

    render () {
        const { highlights, profiles, search } = this.props;

        return (
          <div className="panel">
            <ProfilePanelsHeader />
            <div className="panel__content highlights-panel">
              <div
                className="flex-center-y"
                style={{ justifyContent: 'flex-end', height: '50px', width: '100%' }}
              >
                <Search onChange={this.onSearchChange} style={{ width: '200px' }} value={search} />
              </div>
              <div>
                {highlights.map(highlight => (
                  <HighlightCard
                    deleteHighlight={this.props.highlightDelete}
                    highlight={highlight}
                    key={highlight.get('id')}
                    profiles={profiles}
                  />
                ))}
              </div>
            </div>
          </div>
        );
    }
}

HighlightsPanel.propTypes = {
    highlightDelete: PropTypes.func.isRequired,
    highlights: PropTypes.shape(),
    highlightSearch: PropTypes.func,
    profileGetList: PropTypes.func.isRequired,
    profiles: PropTypes.shape().isRequired,
    search: PropTypes.string
};

function mapStateToProps (state) {
    return {
        highlights: selectHighlights(state),
        profiles: state.profileState.get('byId'),
        search: selectHighlightSearch(state),
    };
}

export default connect(
    mapStateToProps,
    {
        highlightDelete,
        highlightSearch,
        profileGetList
    }
)(HighlightsPanel);
