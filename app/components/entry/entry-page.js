import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { parse } from 'querystring';
import throttle from 'lodash.throttle';
import classNames from 'classnames';
import { CommentEditor, CommentsList, DataLoader, EntryPageActions, EntryPageContent,
    EntryPageHeader, Icon } from '../';
import { entryMessages } from '../../locale-data/messages';
import { isInViewport } from '../../utils/domUtils';
import { generalMessages } from '../../locale-data/messages/general-messages';
import { toggleAethWallet } from '../../local-flux/actions/app-actions';

const CHECK_NEW_COMMENTS_INTERVAL = 15; // in seconds

class EntryPage extends Component {
    state = {
        showInHeader: false
    };

    componentDidMount () {
        const { entry, location, match } = this.props;
        const { params } = match;
        const { version } = parse(location.search);
        this.checkNewCommentsInterval = setInterval(
            this.checkNewComments,
            CHECK_NEW_COMMENTS_INTERVAL * 1000
        );
        if (!entry || entry.get('entryId') !== params.entryId ||
                (version !== undefined && entry.getIn(['content', 'version']) !== version)) {
            const { entryId } = params;
            this.getFullEntry();
            this.fetchComments(entryId);
        }
    }

    componentWillReceiveProps (nextProps) {
        const { commentsClean, entry, entryGetLatestVersion, fetchingFullEntry, location,
            match, pendingComments } = this.props;

        const { params } = match;
        const nextParams = nextProps.match.params;
        const { entryId } = nextParams;
        const { version } = parse(nextProps.location.search);
        if (!nextProps.fetchingFullEntry && fetchingFullEntry) {
            // entryGetLatestVersion(entryId);
        }
        if ((params.entryId !== entryId && entry.get('entryId') !== entryId) ||
                (version !== undefined && version !== location.query.version)) {
            commentsClean();
            this.getFullEntry({ props: nextProps });
            this.fetchComments(entryId);
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
    }

    getFullEntry = ({ props } = {}) => {
        const { match } = props || this.props;
        const { akashaId, entryId, ethAddress } = match.params;
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

    render () {
        const { actionAdd, commentsLoadNew, entry, fetchingFullEntry, highlightSave, intl, latestVersion,
            licenses, loggedProfileData, newComments, toggleOutsideNavigation } = this.props;
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
                    commentEditor={this.commentEditor}
                    containerRef={this.container}
                    entry={entry}
                    highlightSave={highlightSave}
                    intl={intl}
                    latestVersion={latestVersion}
                    licenses={licenses}
                    toggleOutsideNavigation={toggleOutsideNavigation}
                  />
                }
                {!entry.content &&
                  <div className="entry-page__unresolved-placeholder">
                    <div className="heading flex-center">
                      {this.props.intl.formatMessage(generalMessages.noPeersAvailable)}
                    </div>
                    <div className="flex-center">
                      <span className="content-link entry-page__retry-button" onClick={this.getFullEntry}>
                        {this.props.intl.formatMessage(generalMessages.retry)}
                      </span>
                    </div>
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
                  ethAddress={entry.getIn(['author', 'ethAddress'])}
                  intl={intl}
                  loggedProfileData={loggedProfileData}
                  parent="0"
                  ref={this.getEditorRef}
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
                  <CommentsList containerRef={this.container} getTriggerRef={this.getTriggerRef} />
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
    intl: PropTypes.shape(),
    latestVersion: PropTypes.number,
    licenses: PropTypes.shape(),
    location: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    match: PropTypes.shape(),
    newComments: PropTypes.shape(),
    pendingComments: PropTypes.shape(),
    toggleOutsideNavigation: PropTypes.func,
};

export default injectIntl(EntryPage);
