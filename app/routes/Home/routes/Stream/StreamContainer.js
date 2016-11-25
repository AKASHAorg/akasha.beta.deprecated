import React, { Component, PropTypes } from 'react';
import { EntryActions, TagActions } from 'local-flux';
import { connect } from 'react-redux';
import TheStream from './components/stream';
import StreamMenu from './components/stream-menu';
import StreamSidebar from './components/stream-sidebar';
import styles from './stream-container.scss';

const LIMIT = 6;

class StreamPage extends Component {
    constructor (props) {
        super(props);

        this.state = {
            filter: 'tag'
        };
    }

    componentWillMount () {
        const { entryActions, loggedProfile } = this.props;
        entryActions.getEntriesStream(loggedProfile.get('akashaId'));
        this.fetchEntries();
    }

    componentWillReceiveProps (nextProps) {
        const { selectedTag, entryActions, params } = nextProps;
        if (selectedTag !== this.props.selectedTag) {
            this.setState({
                filter: 'tag'
            });
            if (params.filter !== 'tag') {
                this.context.router.push(`/${params.akashaId}/explore/tag`);
            }
            entryActions.clearTagEntries();
            if (selectedTag) {
                entryActions.entryTagIterator(selectedTag, 0, LIMIT);
                entryActions.getTagEntriesCount(selectedTag);
            }
        }
    }

    componentWillUnmount () {
        const { entryActions } = this.props;
        entryActions.clearTagEntries();
    }

    fetchEntries = () => {
        const { entryActions, loggedProfile, selectedTag } = this.props;
        const { filter } = this.state;
        switch (filter) {
            case 'bookmarks':
                entryActions.getSavedEntries(loggedProfile.get('akashaId'));
                break;
            case 'tag':
                if (selectedTag) {
                    entryActions.entryTagIterator(selectedTag, 0, LIMIT);
                    entryActions.getTagEntriesCount(selectedTag);
                }
                break;
            default:
                break;
        }
    };

    handleTabActivation = (tab) => {
        const { params } = this.props;
        this.context.router.push(`/${params.akashaId}/explore/${tab.props.value}`);
    };

    handleFilterChange = (val) => {
        if (val === this.state.filter) return;
        this.setState({
            filter: val
        });
    };

    render () {
        const { loggedProfileData, streamTags, newestTags, selectedTag, tagActions,
            moreNewTags } = this.props;
        const subscriptionsCount = parseInt(loggedProfileData.get('subscriptionsCount'), 10);
        return (
          <div className={`${styles.root}`}>
            <div
              className={`${styles.streamPageInner}`}
            >
              <StreamMenu
                activeTab={this.state.filter}
                selectedTag={selectedTag}
                onChange={this.handleFilterChange}
                onActive={this.handleTabActivation}
              />
            </div>
            <div className={`row ${styles.streamPageContent}`} >
              <div className={`col-xs-12 ${styles.streamPageContentInner}`} >
                <div className={`row ${styles.content}`} >
                  <div className={`col-xs-8 ${styles.theStream}`} >
                    <TheStream>
                      {this.props.children}
                    </TheStream>
                  </div>
                  <div
                    className={`col-xs-4 ${styles.streamSidebarWrapper}`}
                    style={{ backgroundColor: '#F5F5F5' }}
                  >
                    <StreamSidebar
                      subscriptionsCount={subscriptionsCount}
                      selectedTag={selectedTag}
                      streamTags={streamTags}
                      newestTags={newestTags}
                      moreNewTags={moreNewTags}
                      tagActions={tagActions}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

StreamPage.propTypes = {
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    streamTags: PropTypes.shape(),
    newestTags: PropTypes.shape(),
    moreNewTags: PropTypes.bool,
    selectedTag: PropTypes.string,
    entryActions: PropTypes.shape(),
    children: PropTypes.node,
    params: PropTypes.shape()
};

StreamPage.contextTypes = {
    router: React.PropTypes.object
};
/* eslint-disable no-unused-vars */
function mapStateToProps (state, ownProps) {
    return {
        loggedProfile: state.profileState.get('loggedProfile'),
        loggedProfileData: state.profileState.get('profiles').find(prf =>
            prf.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        streamTags: state.entryState.getIn(['entriesStream', 'tags']),
        newestTags: state.tagState.get('newestTags'),
        moreNewTags: state.tagState.get('moreNewTags'),
        selectedTag: state.tagState.get('selectedTag')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        entryActions: new EntryActions(dispatch),
        tagActions: new TagActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StreamPage);
