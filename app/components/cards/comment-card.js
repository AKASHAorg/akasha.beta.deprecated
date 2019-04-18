import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import classNames from 'classnames';
import { convertFromRaw, EditorState } from 'draft-js';
import { Icon, ProfilePopover, ShareLinkModal, VotePopover, VotesModal } from '../';
import * as actionTypes from '../../constants/action-types';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { toggleOutsideNavigation } from '../../local-flux/actions/app-actions';
import { commentsGetComment } from '../../local-flux/actions/comments-actions';
import { entryPageShow } from '../../local-flux/actions/entry-actions';
import { ProfileRecord } from '../../local-flux/reducers/state-models/profile-state-model';
import {
    actionSelectors,
    commentSelectors,
    entrySelectors,
    externalProcessSelectors,
    profileSelectors,
    settingsSelectors
} from '../../local-flux/selectors';
import { entryMessages, generalMessages } from '../../locale-data/messages';
import { getDisplayName } from '../../utils/dataModule';
import { addPrefix } from '../../utils/url-utils';
import withRequest from '../high-order-components/with-request';

const ContentPlaceholder = () => (
    <div>
        <div className="content-placeholder comment-card__content-placeholder"
             style={ { marginTop: '8px' } }/>
        <div className="content-placeholder comment-card__content-placeholder"
             style={ { marginTop: '8px' } }/>
        <div className="content-placeholder comment-card__content-placeholder"
             style={ { marginTop: '8px' } }/>
        <div className="content-placeholder comment-card__content-placeholder"
             style={ { marginTop: '8px' } }/>
    </div>
);

class CommentCard extends Component {
    constructor (props) {
        super(props);

        this.state = {
            expanded: null,
            hidden: false,
            showVotes: false,
        };
    }

    componentDidMount () {
        const { comment } = this.props;
        if (comment.content) {
            const content = convertFromRaw(JSON.parse(comment.content));
            const editorState = EditorState.createWithContent(content);
            const text = editorState.getCurrentContent().getPlainText();
            this.setState({
                expanded: text.length > 240 ? false : null,
                content: text
            });
        }
    }

    shouldComponentUpdate (nextProps, nextState) { // eslint-disable-line complexity
        const {
            author, blockNr, comment, entry,
            isPending, large, style, votePending
        } = nextProps;
        if (blockNr !== this.props.blockNr ||
            !comment.equals(this.props.comment) ||
            !entry.equals(this.props.entry) ||
            isPending !== this.props.isPending ||
            large !== this.props.large ||
            !author.equals(this.props.author) ||
            (style && style.width !== this.props.style.width) ||
            votePending !== this.props.votePending ||
            nextState.content !== this.state.content ||
            nextState.expanded !== this.state.expanded ||
            nextState.hidden !== this.state.hidden ||
            nextState.showVotes !== this.state.showVotes
        ) {
            return true;
        }
        return false;
    }

    componentWillReceiveProps (nextProps) {
        const { comment, isPending } = nextProps;
        if (comment.content && !isPending && this.props.isPending) {
            const content = convertFromRaw(JSON.parse(comment.content));
            const editorState = EditorState.createWithContent(content);
            const text = editorState.getCurrentContent().getPlainText();
            this.setState({
                expanded: text.length > 240 ? false : null,
                content: text
            });
        }
    }

    showHiddenContent = () => {
        this.setState({
            hidden: true
        });
    };

    isOwnComment = () => {
        const { comment, loggedEthAddress } = this.props;
        return comment.getIn(['author', 'ethAddress']) === loggedEthAddress;
    };

    openVotesPanel = () => {
        this.setState({
            showVotes: true
        });
    };

    closeVotesPanel = () => {
        this.setState({
            showVotes: false
        });
    };

    onRetry = () => {
        const { comment, contextId, entry, dispatchAction } = this.props;
        dispatchAction(commentsGetComment({
            context: contextId,
            entryId: entry.entryId,
            commentId: comment.commentId
        }));
    };

    handleVote = ({ type, weight }) => {
        const { comment, entry, loggedEthAddress } = this.props;
        const payload = {
            commentId: comment.commentId,
            entryId: entry.entryId,
            entryTitle: entry.getIn(['content', 'title']),
            weight
        };
        this.props.actionAdd(loggedEthAddress, type, payload);
    };

    toggleExpanded = (ev) => {
        ev.preventDefault();
        this.setState({
            expanded: !this.state.expanded
        });
    };

    renderHiddenContent = () => (
        <div key="hidden" style={ { position: 'relative' } }>
            <ContentPlaceholder/>
            <div className="comment-card__hidden">
                <div className="heading flex-center">
                    { this.props.intl.formatMessage(entryMessages.hiddenContent, {
                        score: this.props.hideCommentSettings.value
                    }) }
                </div>
                <div className="heading comment-card__hidden-message">
                    { this.props.intl.formatMessage(entryMessages.hiddenContent2) }
                    <Link className="comment-card__settings-link" to="/profileoverview/settings">
                        { this.props.intl.formatMessage(entryMessages.hiddenContent3) }
                    </Link>
                </div>
                <div className="flex-center">
            <span className="content-link comment-card__retry-button"
                  onClick={ this.showHiddenContent }>
              { this.props.intl.formatMessage(entryMessages.showAnyway) }
            </span>
                </div>
            </div>
        </div>
    );

    renderUnresolvedPlaceholder = () => (
        <div style={ { position: 'relative' } }>
            <ContentPlaceholder/>
            <div className="comment-card__unresolved">
                <div className="heading flex-center">
                    { this.props.intl.formatMessage(generalMessages.noPeersAvailable) }
                </div>
                <div className="flex-center">
            <span className="content-link comment-card__retry-button" onClick={ this.onRetry }>
              { this.props.intl.formatMessage(generalMessages.retry) }
            </span>
                </div>
            </div>
        </div>
    );

    renderExpandButton = () => {
        const { intl } = this.props;
        const { expanded } = this.state;
        const label = expanded ?
            intl.formatMessage(entryMessages.showLess) :
            intl.formatMessage(entryMessages.showMore);
        const className = classNames('flex-center comment__expand-button', {
            'comment__expand-button_active': !expanded
        });
        return (
            <div className={ className } key="expand-button">
                <div className="flex-center-y content-link" onClick={ this.toggleExpanded }>
                    <Icon className="comment__expand-button-icon"
                          type={ expanded ? 'arrowUp' : 'arrowDown' }/>
                    { label }
                </div>
            </div>
        );
    };

    renderHeader () {
        const { author, comment, entry, intl, isPending } = this.props;
        if (isPending) {
            return (
                <div className="comment-card__header">
                    <div className="comment-card__title-placeholder"/>
                    <div className="comment-card__subtitle-placeholder"/>
                </div>
            );
        }
        const entryTitle = entry.getIn(['content', 'title']) || intl.formatMessage(generalMessages.anEntry);
        const publishDate = new Date(comment.get('publishDate') * 1000);
        return (
            <div className="comment-card__header">
                <div>
                    <ProfilePopover ethAddress={ author.ethAddress }>
                <span className="content-link">
                  { getDisplayName(author.toJS()) }
                </span>
                    </ProfilePopover>
                    <span className="comment-card__commentedOn">
                { comment.parent === '0' ?
                    intl.formatMessage(entryMessages.commentedOn) :
                    intl.formatMessage(entryMessages.repliedOn)
                }
              </span>
                    <Link
                        className="unstyled-link"
                        to={ {
                            pathname: `/${ entry.getIn(['author', 'ethAddress']) || '0x0' }/${ entry.entryId }`,
                            state: { overlay: true }
                        } }
                    >
                <span className="content-link">
                  { entryTitle }
                </span>
                    </Link>
                </div>
                <div className="comment-card__subtitle">
                    { comment.get('publishDate') &&
                    <span>
                  { intl.formatRelative(publishDate) }
                </span>
                    }
                </div>
            </div>
        );
    }

    renderShareIcon = () => {
        const { entry } = this.props;
        const url = addPrefix(`/${ entry.author.ethAddress || '0x0' }/${ entry.entryId }`);

        return <ShareLinkModal url={ url }/>;
    };

    renderActions () { // eslint-disable-line complexity
        const { blockNr, comment, containerRef, vote, votePending } = this.props;
        const { content } = this.state;
        const iconClassName = 'comment-card__vote-icon';
        const voteProps = {
            containerRef, iconClassName, isOwnEntity: this.isOwnComment(), votePending, vote
        };
        const commentTitle = (content.length > 25) ?
            `${ content.slice(0, 25) }...` :
            content;
        return (
            <div className="entry-actions" key="actions">
                <div className="flex-center-y">
                    <div>
                        <div className="flex-center-y">
                            <div className="flex-center entry-actions__vote-wrapper">
                                <VotePopover
                                    onSubmit={ this.handleVote }
                                    type={ actionTypes.commentUpvote }
                                    { ...voteProps }
                                />
                            </div>
                            <div className="flex-center entry-actions__score">
                    <span className="content-link" onClick={ this.openVotesPanel }>
                      { comment.score }
                    </span>
                            </div>
                            <div className="flex-center entry-actions__vote-wrapper">
                                <VotePopover
                                    onSubmit={ this.handleVote }
                                    type={ actionTypes.commentDownvote }
                                    { ...voteProps }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="entry-actions__right-actions">
                        { this.renderShareIcon() }
                    </div>
                </div>
                { this.state.showVotes &&
                <VotesModal
                    closeVotesPanel={ this.closeVotesPanel }
                    content={ comment }
                    contentTitle={ commentTitle }
                    blockNr={ blockNr }
                />
                }
            </div>
        );
    }

    /* eslint-disable complexity */
    render () {
        const {
            comment, entry, hideCommentSettings, isPending, large,
            style
        } = this.props;
        const { content, expanded, hidden } = this.state;
        const entryId = entry && entry.get('entryId');
        const ethAddress = entry && (entry.getIn(['author', 'ethAddress']) || '0x0');
        const commentId = comment.commentId;
        const hasContent = !!content;
        const hideContent = !this.isOwnComment() && hideCommentSettings.checked &&
            comment.score < hideCommentSettings.value && !hidden;
        const cardClass = classNames('comment-card', {
            'comment-card_large': large,
        });
        return (
            <Card
                className={ cardClass }
                style={ style }
                title={ this.renderHeader() }
            >
                { isPending && <ContentPlaceholder/> }
                { hasContent && !isPending &&
                [!hideContent &&
                <div className="comment-card__excerpt" key="excerpt">
                    <Link
                        className="unstyled-link"
                        to={ {
                            pathname: `/${ ethAddress }/${ entryId }/comment/${ commentId }`,
                            state: { overlay: true }
                        } }
                    >
                    <span className="content-link">
                      { expanded !== false ? content : `${ content.slice(0, 240) }...` }
                    </span>
                    </Link>
                </div>,
                    expanded !== null && this.renderExpandButton(),
                    hideContent && this.renderHiddenContent(entryId),
                    this.renderActions()
                ]
                }
                { !hasContent && !isPending &&
                this.renderUnresolvedPlaceholder()
                }
            </Card>
        );
    }
}

CommentCard.defaultProps = {
    author: new ProfileRecord(),
    style: {}
};

CommentCard.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    author: PropTypes.shape().isRequired,
    blockNr: PropTypes.number,
    baseUrl: PropTypes.string,
    comment: PropTypes.shape().isRequired,
    commentsGetComment: PropTypes.func.isRequired,
    containerRef: PropTypes.shape(),
    contextId: PropTypes.string,
    entry: PropTypes.shape().isRequired,
    entryPageShow: PropTypes.func.isRequired,
    hideCommentSettings: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    isPending: PropTypes.bool,
    large: PropTypes.bool,
    loggedEthAddress: PropTypes.string,
    style: PropTypes.shape(),
    toggleOutsideNavigation: PropTypes.func,
    vote: PropTypes.string,
    votePending: PropTypes.bool,
};

function mapStateToProps (state, ownProps) {
    const comment = commentSelectors.selectCommentById(state, ownProps.itemId);
    const entryId = comment.entryId;
    return {
        author: profileSelectors.selectProfileByEthAddress(state, comment.author.ethAddress),
        baseUrl: externalProcessSelectors.getBaseUrl(state),
        blockNr: externalProcessSelectors.getCurrentBlockNumber(state),
        comment,
        entry: entrySelectors.selectEntryById(state, entryId),
        hideCommentSettings: settingsSelectors.getHideCommentSettings(state),
        isPending: commentSelectors.selectCommentIsPending(state, ownProps.contextId, ownProps.itemId),
        loggedEthAddress: profileSelectors.selectLoggedEthAddress(state),
        vote: commentSelectors.selectCommentVote(state, ownProps.itemId),
        votePending: !!actionSelectors.getPendingCommentVote(state, ownProps.itemId)
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        entryPageShow,
        toggleOutsideNavigation
    }
)(withRouter(injectIntl(withRequest(CommentCard))));
