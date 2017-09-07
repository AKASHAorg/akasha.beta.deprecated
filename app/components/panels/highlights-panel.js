import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input } from 'antd';
import { HighlightCard, ProfilePanelsHeader } from '../';
import { highlightDelete, highlightSearch } from '../../local-flux/actions/highlight-actions';
import { profileGetList } from '../../local-flux/actions/profile-actions';
import { ProfileRecord } from '../../local-flux/reducers/records';
import { selectHighlights, selectHighlightSearch } from '../../local-flux/selectors';

const { Search } = Input;

class HighlightsPanel extends Component {
    componentDidMount () {
        const { highlights } = this.props;
        const akashaIds = highlights.map(highlight => ({ akashaId: highlight.get('publisher') }));
        this.props.profileGetList(akashaIds.toJS());
    }

    shouldComponentUpdate (nextProps) {
        const { highlights, profiles, search } = this.props;
        return (
            !highlights.equals(nextProps.highlights) ||
            !profiles.equals(nextProps.profiles) ||
            search !== nextProps.search
        );
    }

    getContainerRef = (el) => { this.container = el; };

    onSearchChange = (ev) => {
        this.props.highlightSearch(ev.target.value);
    };

    render () {
        const { highlights, profiles, search } = this.props;

        return (
          <div className="panel">
            <ProfilePanelsHeader />
            <div className="panel__content highlights-panel" ref={this.getContainerRef}>
              <div
                className="flex-center-y"
                style={{ justifyContent: 'flex-end', height: '50px', width: '100%' }}
              >
                <Search onChange={this.onSearchChange} style={{ width: '200px' }} value={search} />
              </div>
              <div>
                {highlights.map((highlight) => {
                    const publisher = profiles.get(highlight.get('publisher')) || new ProfileRecord();
                    return (
                      <HighlightCard
                        containerRef={this.container}
                        deleteHighlight={this.props.highlightDelete}
                        highlight={highlight}
                        key={highlight.get('id')}
                        publisher={publisher}
                      />
                    );
                })}
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
