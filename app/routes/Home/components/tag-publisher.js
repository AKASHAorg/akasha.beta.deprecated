import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ProfileActions, AppActions, TagActions, TransactionActions } from 'local-flux';

class TagPublisher extends Component {
    componentWillMount () {
        const { tagActions, loggedProfile } = this.props;
        if (loggedProfile.get('profile')) {
            console.log(loggedProfile.get('profile'), 'has profile. getting pending tags');
            tagActions.getPendingTags(loggedProfile.get('profile'));
        }
    }
    componentWillReceiveProps (nextProps) {
        const { pendingTags, loggedProfile, pendingTransactions, minedTransactions } = nextProps;
        const { tagActions, transactionActions, appActions, profileActions } = this.props;
        const tokenIsValid = this._checkTokenValidity(loggedProfile.get('expiration'));
        console.log(pendingTags, 'pendingTags');
        if (pendingTags.size > 0) {
            pendingTags.forEach((tagObj) => {
                if (tagObj.publishConfirmed) {
                    appActions.hidePublishConfirmDialog();
                }
                if (!tagObj.publishConfirmed) {
                    appActions.showPublishConfirmDialog({
                        type: 'tag',
                        ...tagObj
                    });
                } else if (!tokenIsValid) {
                    appActions.showAuthDialog();
                } else if (!tagObj.tx) {
                    this._registerTag(tagObj);
                } else if (tagObj.tx) {
                    this._listenTagTx(tagObj);
                }
            });
        }
        return null;
    }
    _checkTokenValidity = expDate =>
        Date.parse(expDate) > Date.now();

    _registerTag = (tagObj) => {
        const { tagActions, loggedProfile } = this.props;
        tagActions.registerTag(tagObj.tag, loggedProfile.get('profile'), tagObj.minGas);
    }

    _listenTagTx = (tagObj) => {
        const { transactionActions } = this.props;
        transactionActions.emitMined();
        transactionActions.addToQueue([{ tx: tagObj.tx }]);
    }

    render () {
        return null;
    }
}

TagPublisher.propTypes = {
    pendingTags: PropTypes.shape(),
    tagActions: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    transactionActions: PropTypes.shape()
};

function mapStateToProps (state) {
    return {
        loggedProfile: state.profileState.get('loggedProfile'),
        loggedProfileData: state.profileState.get('profiles').find(prf =>
            prf.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        pendingTags: state.tagState.get('pendingTags'),
        pendingTransactions: state.transactionState.get('pending')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        tagActions: new TagActions(dispatch),
        transactionActions: new TransactionActions(dispatch),
        profileActions: new ProfileActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TagPublisher);
