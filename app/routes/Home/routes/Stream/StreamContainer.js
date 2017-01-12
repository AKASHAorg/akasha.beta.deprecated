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
        const { params } = props;
        this.state = {
            filter: params.filter,
            tag: params.tag
        };
    }

    componentDidMount () {
        const { entryActions, loggedProfile, params } = this.props;
        entryActions.getEntriesStream(loggedProfile.get('akashaId'));
        if (params.tag && params.filter === 'tag') {
            entryActions.entryTagIterator(params.tag, 0, LIMIT + 1);
            entryActions.getTagEntriesCount(params.tag);
        } else if (params.filter === 'bookmarks') {
            entryActions.getSavedEntriesList(LIMIT);
        }
    }

    componentWillReceiveProps (nextProps) {
        const { params, entryActions } = nextProps;
        if (params.tag && params.tag !== this.props.params.tag) {
            this.setState({
                filter: 'tag',
                tag: params.tag
            });
            entryActions.clearTagEntries();
            if (params.tag) {
                entryActions.entryTagIterator(params.tag, 0, LIMIT + 1);
                entryActions.getTagEntriesCount(params.tag);
            }
        } else if (params.filter !== this.props.params.filter) {
            this.setState({
                filter: params.filter
            });
            switch (params.filter) {
                case 'tag':
                    entryActions.clearSavedEntries();
                    entryActions.entryTagIterator(this.state.tag, 0, LIMIT + 1);
                    entryActions.getTagEntriesCount(this.state.tag);
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

    handleFilterChange = (val) => {
        const { params, selectedTag } = this.props;
        const tag = this.state.tag || selectedTag;
        const tagPath = val === 'tag' && tag ? `/${tag}` : '';
        this.context.router.push(`/${params.akashaId}/explore/${val}${tagPath}`);
    };

    render () {
        const { loggedProfileData, streamTags, newestTags, entryActions, tagActions,
            moreNewTags, tagEntries, params, selectedTag } = this.props;
        const { tag } = this.state;
        const subscriptionsCount = parseInt(loggedProfileData.get('subscriptionsCount'), 10);
        return (
          <div className={`${styles.root}`}>
            <div className={`${styles.streamPageInner}`}>
              <StreamMenu
                activeTab={this.state.filter}
                selectedTag={tag || selectedTag}
                onChange={this.handleFilterChange}
                onActive={this.handleTabActivation}
              />
            </div>
            <div className={`row ${styles.streamPageContent}`} >
              <div className={`col-xs-12 ${styles.streamPageContentInner}`} >
                <div className={styles.theStream}>
                  <TheStream
                    entryActions={entryActions}
                    selectedTag={tag}
                    tagEntries={tagEntries}
                    params={params}
                  >
                    {this.props.children}
                  </TheStream>
                </div>
                <div
                  className={styles.streamSidebarWrapper}
                  style={{ backgroundColor: '#F3F3F3' }}
                >
                  <StreamSidebar
                    subscriptionsCount={subscriptionsCount}
                    selectedTag={tag || selectedTag}
                    streamTags={streamTags}
                    newestTags={newestTags}
                    moreNewTags={moreNewTags}
                    tagActions={tagActions}
                    params={params}
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
    tagActions: PropTypes.shape(),
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
