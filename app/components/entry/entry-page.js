import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import throttle from 'lodash.throttle';
import classNames from 'classnames';
import { CommentEditor, CommentsList, DataLoader, EntryPageActions, EntryPageContent,
    EntryPageHeader, Icon } from '../';
import { entryMessages } from '../../locale-data/messages';
import { isInViewport } from '../../utils/domUtils';
import { generalMessages } from '../../locale-data/messages/general-messages';

const CHECK_NEW_COMMENTS_INTERVAL = 15000; // in ms

class EntryPage extends Component {
    state = {
        showInHeader: false
    };

    componentDidMount () {
        const { entry, match } = this.props;
        const { params } = match;
        if (!entry || entry.get('entryId') !== params.entryId) {
            this.getFullEntry();
        }
    }

    componentWillReceiveProps (nextProps) {
        const { entry, match, pendingComments } = this.props;

        const { params } = match;
        const nextParams = nextProps.match.params;
        const { entryId } = nextParams;

        if (params.entryId !== entryId && entry.get('entryId') !== entryId) {
            this.getFullEntry({ props: nextProps });
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
        const { entryCleanFull } = this.props;
        if (this.container) {
            this.container.removeEventListener('scroll', this.throttledHandler);
        }
        clearInterval(this.checkNewCommentsInterval);
        entryCleanFull();
    }

    getFullEntry = ({ props } = {}) => {
        const { match } = props || this.props;
        const { akashaId, entryId, ethAddress } = match.params;
        this.fetchComments(entryId);
        if (this.checkNewCommentsInterval) {
            clearInterval(this.checkNewCommentsInterval);
        }
        this.checkNewCommentsInterval = setInterval(
            this.checkNewComments,
            CHECK_NEW_COMMENTS_INTERVAL
        );
        const prefixed = ethAddress === '0' ? undefined : `0x${ethAddress}`;
        const version = parseInt(match.params.version, 10);
        const versionNr = isNaN(Number(version)) ? null : Number(version);
        this.props.entryGetFull({ akashaId, entryId, ethAddress: prefixed, version: versionNr });
    };

    getContainerRef = (el) => { this.container = el; };

    getListHeaderRef = (el) => { this.listHeader = el; };

    getTriggerRef = (el) => { this.trigger = el; };

    getEditorRef = (editor) => {
        this.commentEditor = editor && editor.refs.clickAwayableElement;
    };

    fetchComments = (entryId) => {
        this.props.commentsIterator({ entryId, parent: '0' });
    };

    checkNewComments = () => {
        const { commentsCheckNew, match } = this.props;
        commentsCheckNew({ entryId: match.params.entryId });
    };

    handleContentScroll = () => {
        const { commentsMoreIterator, match, newComments } = this.props;
        const { params } = match;
        if (this.trigger && isInViewport(this.trigger, 150)) {
            commentsMoreIterator({ entryId: params.entryId, parent: '0' });
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
    };

    throttledHandler = throttle(this.handleContentScroll, 300);
    _handleEditorEnableSwitch = (enabled) => {
        this.setState({
            editorEnabled: enabled
        });
    }
    _handleEditorFocus = () => {
        if (!this.state.editorEnabled) {
            this.commentEditor.onWrapperClick(true);
        }
    }
    onRetry = () => {
        const { entry, entryResolveIpfsHash } = this.props;
        const { entryId } = this.props.match.params;
        entryResolveIpfsHash({ entryId, ipfsHash: entry.get('ipfsHash') });
    };

    render () { // eslint-disable-line complexity
        const {
            actionAdd, baseUrl, commentsLoadNew, entry, fetchingFullEntry, fullSizeImageAdd,
            highlightSave, intl, latestVersion, licenses, loggedProfileData, newComments, resolvingIpfsHash,
            toggleOutsideNavigation
        } = this.props;
        const { showInHeader } = this.state;
        const buttonWrapperClass = classNames({
            'entry-page__button-wrapper_fixed': showInHeader,
            'entry-page__button-wrapper_absolute': !showInHeader
        });
        const commentsCount = entry && entry.get('commentsCount');

        const component = !entry || fetchingFullEntry ?
            null :
            (<div className="entry-page__inner">
              <div id="content-section" className="entry-page__content">
                <EntryPageHeader
                  containerRef={this.container}
                  latestVersion={latestVersion}
                />
                {entry.content &&
                  <EntryPageContent
                    baseUrl={baseUrl}
                    commentEditor={this.commentEditor}
                    containerRef={this.container}
                    entry={entry}
                    fullSizeImageAdd={fullSizeImageAdd}
                    highlightSave={highlightSave}
                    intl={intl}
                    latestVersion={latestVersion}
                    licenses={licenses}
                    toggleOutsideNavigation={toggleOutsideNavigation}
                  />
                }
                {!entry.content &&
                  <div className="entry-page__unresolved-placeholder">
                    <DataLoader flag={resolvingIpfsHash}>
                      <div className="heading flex-center">
                        {this.props.intl.formatMessage(generalMessages.noPeersAvailable)}
                      </div>
                      <div className="flex-center">
                        <span className="content-link entry-page__retry-button" onClick={this.onRetry}>
                          {this.props.intl.formatMessage(generalMessages.retry)}
                        </span>
                      </div>
                    </DataLoader>
                  </div>
                }
                {entry.content &&
                  <EntryPageActions containerRef={this.container} entry={entry} isFullEntry />
                }
              </div>
              <div className="entry-page__comments">
                <div className="entry-page__comments-header">
                  <span className="entry-page__comments-title">
                    {commentsCount ?
                        intl.formatMessage(entryMessages.publicDiscussion) :
                        intl.formatMessage(entryMessages.writeComment)
                    }
                  </span>
                  {!!commentsCount &&
                    <div className="flex-center">
                      <span>
                        {intl.formatMessage(entryMessages.commentsCount, { count: commentsCount })}
                      </span>
                      <Icon className="entry-page__comment-icon" type="commentLarge" />
                    </div>
                  }
                </div>
                <CommentEditor
                  actionAdd={actionAdd}
                  containerRef={this.container}
                  entryId={entry.get('entryId')}
                  entryTitle={entry.getIn(['content', 'title'])}
                  ethAddress={entry.getIn(['author', 'ethAddress'])}
                  intl={intl}
                  loggedProfileData={loggedProfileData}
                  parent="0"
                  ref={this.getEditorRef}
                  onEnable={this._handleEditorEnableSwitch}
                />
                <div
                  id="comments-section"
                  ref={(el) => { this.commentsSectionRef = el; }}
                >
                  <div className="entry-page__new-comments-wrapper" ref={this.getListHeaderRef}>
                    {newComments.size > 0 &&
                      <div className={buttonWrapperClass}>
                        <div style={{ position: 'relative' }}>
                          <div className="content-link entry-page__new-comments" onClick={commentsLoadNew}>
                            {intl.formatMessage(entryMessages.newComments, {
                                count: newComments.size
                            })}
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                  <CommentsList
                    containerRef={this.container}
                    getTriggerRef={this.getTriggerRef}
                    onNewCommentButtonClick={this._handleEditorFocus}
                  />
                </div>
              </div>
            </div>);

        return (
          <div
            className="entry-page"
            id="entry-page-root"
            ref={this.getContainerRef}
          >
            <DataLoader flag={!entry || fetchingFullEntry} size="large" style={{ paddingTop: '120px' }}>
              {component}
            </DataLoader>
          </div>
        );
    }
}

EntryPage.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    baseUrl: PropTypes.string.isRequired,
    commentsCheckNew: PropTypes.func.isRequired,
    commentsIterator: PropTypes.func.isRequired,
    commentsLoadNew: PropTypes.func.isRequired,
    commentsMoreIterator: PropTypes.func.isRequired,
    entry: PropTypes.shape(),
    entryCleanFull: PropTypes.func.isRequired,
    entryGetFull: PropTypes.func.isRequired,
    entryResolveIpfsHash: PropTypes.func.isRequired,
    fetchingFullEntry: PropTypes.bool,
    fullSizeImageAdd: PropTypes.func,
    highlightSave: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    latestVersion: PropTypes.number,
    licenses: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    match: PropTypes.shape(),
    newComments: PropTypes.shape(),
    pendingComments: PropTypes.shape(),
    resolvingIpfsHash: PropTypes.bool,
    toggleOutsideNavigation: PropTypes.func,
};

export default injectIntl(EntryPage);
