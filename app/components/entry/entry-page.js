import PropTypes from 'prop-types';
/* eslint import/no-unresolved: 0, import/extensions: 0 */
import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { Divider, FlatButton } from 'material-ui';
import { injectIntl } from 'react-intl';
import { parse } from 'querystring';
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce'; // eslint-disable-line no-unused-vars
import { CommentEditor, CommentsList, DataLoader, EntryPageActions, EntryPageContent,
    EntryPageHeader } from '../';
import { entryMessages } from '../../locale-data/messages';
import { isInViewport } from '../../utils/domUtils';
import styles from './entry-page.scss';
import { Tooltip } from 'antd';
const COMMENT_FETCH_LIMIT = 25;
const CHECK_NEW_COMMENTS_INTERVAL = 15; // in seconds

class EntryPage extends Component {
    state = {
        publisherTitleShadow: false,
    };

    componentDidMount () {
        const { entry, entryGetFull, location, match } = this.props;
        const { params } = match;
        const { version } = parse(location.search);
        ReactTooltip.rebuild();
        this.checkNewCommentsInterval = setInterval(
            this.checkNewComments,
            CHECK_NEW_COMMENTS_INTERVAL * 1000
        );
        if (!entry || entry.get('entryId') !== params.entryId ||
                (version !== undefined && entry.getIn(['content', 'version']) !== version)) {
            const versionNr = isNaN(Number(version)) ? null : Number(version);
            entryGetFull(params.entryId, versionNr);
            this.fetchComments(params.entryId);
        }
    }

    componentWillReceiveProps (nextProps) {
        const { entry, entryGetFull, entryGetLatestVersion, fetchingFullEntry, location, match,
            pendingComments } = this.props;
        const { params } = match;
        const nextParams = nextProps.match.params;
        const { version } = parse(nextProps.location.search);
        if (!nextProps.fetchingFullEntry && fetchingFullEntry) {
            entryGetLatestVersion(nextProps.match.params.entryId);
        }
        if ((params.entryId !== nextParams.entryId && entry.get('entryId') !== nextParams.entryId) ||
                (version !== undefined && version !== location.query.version)) {
            const versionNr = isNaN(Number(version)) ? null : Number(version);
            entryGetFull(nextParams.entryId, versionNr);
            this.fetchComments(nextParams.entryId);
        }
        if (!this.listenerRegistered && this.container) {
            this.container.addEventListener('scroll', this.throttledHandler);
            this.listenerRegistered = true;
        }
        if (this.commentEditor && nextProps.pendingComments.size > pendingComments.size) {
            this.commentEditor.resetEditorState();
        }
    }

    componentDidUpdate (prevProps) {
        // target the first new comment loaded and scroll into view
        const { newComments } = this.props;
        if ((prevProps.newComments.size > 0) && (newComments.size === 0)) {
            const targetId = prevProps.newComments.first().commentId;
            const node = document.getElementById(`comment-${targetId}`);
            if (node) {
                node.scrollIntoViewIfNeeded(true);
            }
        }
    }

    componentWillUnmount () {
        const { commentsClean, entryCleanFull } = this.props;
        if (this.container) {
            this.container.removeEventListener('scroll', this.throttledHandler);
        }
        clearInterval(this.checkNewCommentsInterval);
        entryCleanFull();
        commentsClean();
        ReactTooltip.hide();
    }

    getContainerRef = el => (this.container = el);

    getListHeaderRef = el => (this.listHeader = el);

    getTriggerRef = el => (this.trigger = el);

    fetchComments = (entryId) => {
        this.props.commentsIterator(entryId, COMMENT_FETCH_LIMIT);
    };

    checkNewComments = () => {
        const { commentsCheckNew, match } = this.props;
        commentsCheckNew(match.params.entryId);
    };

    handleContentScroll = (ev) => {
        const { commentsMoreIterator, match, newComments } = this.props;
        const { params } = match;
        const scrollTop = ev.srcElement.scrollTop;
        if (this.trigger && isInViewport(this.trigger, 150)) {
            commentsMoreIterator(params.entryId);
        }
        if (newComments.size) {
            const rect = this.listHeader.getBoundingClientRect();
            if (rect.top < 0) {
                this.setState({
                    showInHeader: true
                });
            } else {
                this.setState({
                    showInHeader: false
                });
            }
        }
        if (scrollTop > 0 && !this.state.publisherTitleShadow) {
            this.setState({
                publisherTitleShadow: true
            });
        } else if (scrollTop === 0 && this.state.publisherTitleShadow) {
            this.setState({
                publisherTitleShadow: false
            });
        }
    }

    throttledHandler = throttle(this.handleContentScroll, 300);

    selectProfile = () => {
        const { entry, history } = this.props;
        const profileAddress = entry.entryEth.publisher;
        history.push(`/${profileAddress}`);
    };

    render () {
        const { actionAdd, commentsLoadNew, entry, fetchingFullEntry, highlightSave, intl, latestVersion,
            licenses, loggedProfileData, newComments } = this.props;
        const { palette } = this.context.muiTheme;
        const { publisherTitleShadow, showInHeader } = this.state;
        const buttonClassName = showInHeader ? styles.button_fixed : styles.button_absolute;

        const component = !entry || fetchingFullEntry ?
            null :
            (<div className={styles.entry_page_inner}>
              <div id="content-section" className={styles.content_section}>
                <EntryPageHeader
                  latestVersion={latestVersion}
                  publisherTitleShadow={publisherTitleShadow}
                />
                {entry.content &&
                  <EntryPageContent
                    entry={entry}
                    highlightSave={highlightSave}
                    latestVersion={latestVersion}
                    licenses={licenses}
                  />
                }
                {!entry.content &&
                  <div className={styles.unresolved_entry} style={{ color: palette.disabledColor }}>
                    {intl.formatMessage(entryMessages.unresolvedEntry)}
                  </div>
                }
              </div>
              <div className={styles.entry_infos}>
                {entry.content && <EntryPageActions entry={entry} containerRef={this.container} />}
                <CommentEditor
                  actionAdd={actionAdd}
                  containerRef={this.container}
                  entryId={entry.get('entryId')}
                  intl={intl}
                  loggedProfileData={loggedProfileData}
                  ref={editor => (this.commentEditor = editor)}
                />
                <div
                  id="comments-section"
                  className={styles.comments_section}
                  ref={el => (this.commentsSectionRef = el)}
                >
                  <div ref={this.getListHeaderRef} style={{ position: 'relative', zIndex: 2 }}>
                    <h4>
                      {`${intl.formatMessage(entryMessages.allComments)} (${entry.get('commentsCount')})`}
                    </h4>
                    {newComments.size > 0 &&
                      <div className={`row middle-xs ${buttonClassName}`}>
                        <div className="col-xs-12 center-xs" style={{ position: 'relative' }}>
                          <FlatButton
                            primary
                            label={intl.formatMessage(entryMessages.newComments, {
                                count: newComments.size
                            })}
                            hoverColor="#ececec"
                            backgroundColor="#FFF"
                            style={{ position: 'absolute', top: -18, zIndex: 2, left: '50%', marginLeft: '-70px' }}
                            labelStyle={{ fontSize: 12 }}
                            onClick={commentsLoadNew}
                          />
                        </div>
                      </div>
                    }
                    <Divider />
                  </div>
                  <CommentsList containerRef={this.container} getTriggerRef={this.getTriggerRef} />
                </div>
              </div>
            </div>);

        return (
          <div
            className={styles.root}
            id="entry-page-root"
            ref={this.getContainerRef}
            style={{ backgroundColor: palette.entryPageBackground }}
          >
            <DataLoader flag={!entry || fetchingFullEntry} size={80} style={{ paddingTop: '120px' }}>
              {component}
            </DataLoader>
          </div>
        );
    }
}

EntryPage.contextTypes = {
    muiTheme: PropTypes.shape(),
};

EntryPage.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    commentsCheckNew: PropTypes.func.isRequired,
    commentsClean: PropTypes.func.isRequired,
    commentsIterator: PropTypes.func.isRequired,
    commentsLoadNew: PropTypes.func.isRequired,
    commentsMoreIterator: PropTypes.func.isRequired,
    entry: PropTypes.shape(),
    entryCleanFull: PropTypes.func.isRequired,
    entryGetFull: PropTypes.func.isRequired,
    entryGetLatestVersion: PropTypes.func.isRequired,
    fetchingFullEntry: PropTypes.bool,
    highlightSave: PropTypes.func.isRequired,
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    latestVersion: PropTypes.number,
    licenses: PropTypes.shape(),
    location: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    match: PropTypes.shape(),
    newComments: PropTypes.shape(),
    pendingComments: PropTypes.shape(),
};

export default injectIntl(EntryPage);
