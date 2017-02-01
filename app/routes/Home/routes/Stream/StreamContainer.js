import React, { Component, PropTypes } from 'react';
import ReactTooltip from 'react-tooltip';
import { EntryActions, TagActions } from 'local-flux';
import { connect } from 'react-redux';
import TheStream from './components/stream';
import StreamMenu from './components/stream-menu';
import StreamSidebar from './components/stream-sidebar';
import styles from './stream-container.scss';

const LIMIT = 5;
const ALL_STREAM_LIMIT = 10;

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
        } else if (params.filter === 'allEntries') {
            entryActions.allStreamIterator(ALL_STREAM_LIMIT + 1);
        }
    }

    componentWillReceiveProps (nextProps) {
        const { params, entryActions, fetchingSavedEntries } = nextProps;
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
                case 'allEntries':
                    entryActions.clearSavedEntries();
                    entryActions.clearTagEntries();
                    entryActions.allStreamIterator(ALL_STREAM_LIMIT + 1);
                    break;
                case 'tag':
                    entryActions.clearSavedEntries();
                    entryActions.clearAllStream();
                    entryActions.entryTagIterator(this.state.tag, 0, LIMIT + 1);
                    entryActions.getTagEntriesCount(this.state.tag);
                    break;
                case 'bookmarks':
                    entryActions.clearTagEntries();
                    entryActions.clearAllStream();
                    entryActions.getSavedEntriesList(LIMIT);
                    break;
                default:
                    break;
            }
        } else if (params.filter === 'bookmarks' && !fetchingSavedEntries &&
                this.props.fetchingSavedEntries) {
            entryActions.getSavedEntriesList(LIMIT);
        }
    }

    componentWillUnmount () {
        const { entryActions } = this.props;
        entryActions.clearTagEntries();
        entryActions.clearSavedEntries();
        ReactTooltip.rebuild();
    }

    handleFilterChange = (val) => {
        const { params, selectedTag } = this.props;
        const tag = this.state.tag || selectedTag;
        const tagPath = val === 'tag' && tag ? `/${tag}` : '';
        this.context.router.push(`/${params.akashaId}/explore/${val}${tagPath}`);
    };

    render () {
        const { lastAllStreamBlock, loggedProfileData, streamTags, newestTags, entryActions,
            tagActions, moreNewTags, tagEntries, params, selectedTag } = this.props;
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
                    lastAllStreamBlock={lastAllStreamBlock}
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
    fetchingSavedEntries: PropTypes.bool,
    lastAllStreamBlock: PropTypes.number,
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
        fetchingSavedEntries: state.entryState.getIn(['flags', 'fetchingSavedEntries']),
        lastAllStreamBlock: state.entryState.get('lastAllStreamBlock'),
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
        allStreamEntries: state.entryState.get('entries')
            .filter(entry => entry.get('type') === 'allStreamEntry')
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
