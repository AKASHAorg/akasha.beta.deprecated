import React, { Component, PropTypes } from 'react';
import { EntryActions, TagActions } from 'local-flux';
import { connect } from 'react-redux';
import TheStream from './components/stream';
import StreamMenu from './components/stream-menu';
import StreamSidebar from './components/stream-sidebar';
import styles from './stream-container.scss';

const LIMIT = 5;

class StreamPage extends Component {
    constructor (props) {
        super(props);

        this.state = {
            filter: 'tag'
        };
    }

    componentWillMount () {
        const { entryActions, loggedProfile, selectedTag } = this.props;
        entryActions.getEntriesStream(loggedProfile.get('akashaId'));
        if (selectedTag) {
            entryActions.entryTagIterator(selectedTag, 0, LIMIT + 1);
            entryActions.getTagEntriesCount(selectedTag);
        }
    }

    componentWillReceiveProps (nextProps) {
        const { selectedTag, entryActions } = nextProps;
        if (selectedTag !== this.props.selectedTag) {
            this.setState({
                filter: 'tag'
            });
            entryActions.clearTagEntries();
            if (selectedTag) {
                entryActions.entryTagIterator(selectedTag, 0, LIMIT + 1);
                entryActions.getTagEntriesCount(selectedTag);
            }
        }
    }

    componentDidUpdate (prevProps, prevState) {
        const { entryActions, selectedTag } = this.props;
        if (this.state.filter !== prevState.filter) {
            switch (this.state.filter) {
                case 'tag':
                    entryActions.clearSavedEntries();
                    entryActions.entryTagIterator(selectedTag, 0, LIMIT + 1);
                    entryActions.getTagEntriesCount(selectedTag);
                    break;
                case 'bookmarks':
                    entryActions.clearTagEntries();
                    entryActions.getSavedEntriesList(LIMIT);
                    break;
                default:
                    break;
            }
        }
    }

    componentWillUnmount () {
        const { entryActions } = this.props;
        entryActions.clearTagEntries();
        entryActions.clearSavedEntries();
    }

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
        const { loggedProfileData, streamTags, newestTags, selectedTag, entryActions, tagActions,
            moreNewTags, tagEntries, params } = this.props;
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
                <div className={styles.theStream}>
                  <TheStream
                    entryActions={entryActions}
                    selectedTag={selectedTag}
                    tagEntries={tagEntries}
                    params={params}
                  >
                    {this.props.children}
                  </TheStream>
                </div>
                <div
                  className={styles.streamSidebarWrapper}
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
    tagEntries: PropTypes.shape(),
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
        selectedTag: state.tagState.get('selectedTag'),
        tagEntries: state.entryState.get('entries')
            .filter(entry => entry.get('type') === 'tagEntry')
            .map(entry => entry.get('content')),
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
