import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Comment, CommentEditor, OptimisticComment } from '../';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { selectCommentsForParent, selectLoggedProfileData } from '../../local-flux/selectors';
import { entryMessages } from '../../locale-data/messages';
import { getDisplayName } from '../../utils/dataModule';

class CommentThread extends Component {
    componentDidUpdate (prevProps) {
        if (this.props.replyTo && prevProps.replyTo !== this.props.replyTo &&
                this.commentEditorRef) {
            this.commentEditorRef.baseNodeRef.scrollIntoViewIfNeeded(false);
        }
    }

    shouldComponentUpdate (nextProps) {
        const { comment, pendingComments, profiles, replies, replyTo } = nextProps;
        if (
            !comment.equals(this.props.comment) ||
            !pendingComments.equals(this.props.pendingComments) ||
            !profiles.equals(this.props.profiles) ||
            !replies.equals(this.props.replies) ||
            replyTo !== this.props.replyTo
        ) {
            return true;
        }
        return false;
    }

    getEditorRef = (editor) => {
        this.commentEditorRef = editor && editor.refs.clickAwayableElement;
    };

    renderOptimisticComments = () => {
        const { containerRef, comment, loggedProfileData, pendingComments } = this.props;
        const optimisticComments = pendingComments.filter(action =>
            action.getIn(['payload', 'parent']) === comment.commentId
        );
        console.log('optimistic comments', optimisticComments);

        return optimisticComments
            .toArray()
            .map(commAction => (
              <OptimisticComment
                comment={commAction}
                containerRef={containerRef}
                key={commAction.id}
                loggedProfileData={loggedProfileData}
              />
            ));
    };

    renderReplies = () => {
        const { containerRef, ethAddress, loggedProfileData, profiles, replies,
            resolvingComments } = this.props;
        return replies.map(comment => (
          <Comment
            comment={comment}
            containerRef={containerRef}
            ethAddress={ethAddress}
            key={comment.commentId}
            loggedEthAddress={loggedProfileData.get('ethAddress')}
            profiles={profiles}
            resolvingComment={resolvingComments.get(comment.ipfsHash)}
          />
        ));
    };

    renderEditor = () => {
        const { containerRef, comment, entryId, ethAddress, intl, loggedProfileData,
            onReplyClose, profiles } = this.props;
        const author = profiles.get(comment.getIn(['author', 'ethAddress']));
        const name = getDisplayName({
            akashaId: author.get('akashaId'),
            ethAddress: author.get('ethAddress')
        });
        return (
          <div>
            <CommentEditor
              actionAdd={this.props.actionAdd}
              containerRef={containerRef}
              entryId={entryId}
              ethAddress={ethAddress}
              intl={intl}
              isReply
              loggedProfileData={loggedProfileData}
              onClose={onReplyClose}
              parent={comment.commentId}
              placeholder={intl.formatMessage(entryMessages.writeReplyTo, { name })}
              ref={this.getEditorRef}
            />
          </div>
        );
    };

    render () {
        const { comment, containerRef, ethAddress, loggedProfileData, onReply,
            profiles, replies, replyTo, resolvingComments } = this.props;

        return (
          <div className="comment-thread">
            <Comment
              comment={comment}
              containerRef={containerRef}
              ethAddress={ethAddress}
              key={comment.commentId}
              loggedEthAddress={loggedProfileData.get('ethAddress')}
              onReply={onReply}
              profiles={profiles}
              resolvingComment={resolvingComments.get(comment.ipfsHash)}
              showReplyButton
            >
              {!!replies.size && this.renderReplies()}
              {this.renderOptimisticComments()}
              {replyTo === comment.commentId && this.renderEditor()}
            </Comment>
          </div>
        );
    }
}

CommentThread.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    comment: PropTypes.shape().isRequired,
    containerRef: PropTypes.shape(),
    entryId: PropTypes.string,
    ethAddress: PropTypes.string,
    loggedProfileData: PropTypes.shape(),
    intl: PropTypes.shape(),
    onReply: PropTypes.func.isRequired,
    onReplyClose: PropTypes.func.isRequired,
    pendingComments: PropTypes.shape(),
    profiles: PropTypes.shape(),
    replies: PropTypes.shape().isRequired,
    replyTo: PropTypes.string,
    resolvingComments: PropTypes.shape().isRequired,
};

function mapStateToProps (state, ownProps) {
    const { comment } = ownProps;
    return {
        entryId: state.entryState.getIn(['fullEntry', 'entryId']),
        ethAddress: state.entryState.getIn(['fullEntry', 'author', 'ethAddress']),
        loggedProfileData: selectLoggedProfileData(state),
        profiles: state.profileState.get('byEthAddress'),
        replies: selectCommentsForParent(state, comment.commentId),
        resolvingComments: state.commentsState.getIn(['flags', 'resolvingComments'])
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd
    }
)(injectIntl(CommentThread));
