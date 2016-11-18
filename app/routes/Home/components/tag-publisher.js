import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ProfileActions, AppActions, TagActions, TransactionActions } from 'local-flux';

class TagPublisher extends Component {
    constructor () {
        super();
        this.state = {
            registerRequestedTags: [],
            listeningTags: []
        };
    }
    componentWillMount () {
        const { tagActions, loggedProfile } = this.props;
        if (loggedProfile.get('profile')) {
            console.log(loggedProfile.get('profile'), 'has profile. getting pending tags');
            tagActions.getPendingTags(loggedProfile.get('profile'));
        }
    }
    componentWillReceiveProps (nextProps) {
        const { pendingTags, loggedProfile, minedTransactions } = nextProps;
        const { appActions } = this.props;
        const { registerRequestedTags, listeningTags } = this.state;
        const tokenIsValid = this._checkTokenValidity(loggedProfile.get('expiration'));
        console.log(registerRequestedTags, 'registerRequestedTags');
        if (pendingTags.size > 0) {
            pendingTags.forEach((tagObj) => {
                if (tagObj.error) return;
                if (tagObj.publishConfirmed) {
                    appActions.hidePublishConfirmDialog();
                }
                if (tagObj.tx &&
                    minedTransactions.findIndex(minedTx => minedTx.tx === tagObj.tx) !== -1) {
                    this._deletePendingTag(tagObj);
                    return;
                }
                if (tagObj.tx && listeningTags.indexOf(tagObj.tag) === -1) {
                    this._listenTagTx(tagObj);
                    listeningTags.push(tagObj.tag);
                    return;
                }
                if (!tagObj.publishConfirmed && !tagObj.tx) {
                    appActions.showPublishConfirmDialog({
                        type: 'tag',
                        ...tagObj
                    });
                } else if (!tokenIsValid && registerRequestedTags.indexOf(tagObj.tag) === -1) {
                    appActions.showAuthDialog();
                } else if (!tagObj.tx && tokenIsValid && registerRequestedTags.indexOf(tagObj.tag) === -1) {
                    this._registerTag(tagObj, loggedProfile);
                    registerRequestedTags.push(tagObj.tag);
                }
            });
        }
        return null;
    }
    _checkTokenValidity = expDate =>
        Date.parse(expDate) > Date.now();

    _registerTag = (tagObj, loggedProfile) => {
        const { tagActions } = this.props;
        tagActions.registerTag(tagObj.tag, loggedProfile.get('token'), tagObj.minGas);
    }

    _listenTagTx = (tagObj) => {
        const { transactionActions } = this.props;
        let registerRequestedTags = this.state.registerRequestedTags;
        const tagIndex = registerRequestedTags.indexOf(tagObj.tag);
        registerRequestedTags = registerRequestedTags.splice(tagIndex, 1);
        this.setState({
            registerRequestedTags
        }, () => {
            transactionActions.listenForMinedTx();
            transactionActions.addToQueue([{ tx: tagObj.tx }]);
        });
    }
    _deletePendingTag = (tagObj) => {
        const { tagActions, transactionActions, appActions } = this.props;
        let { listeningTags } = this.state;
        // appActions.createInternalNotification({
        //     title: '',
        //     message: '',
        //     created_at: new Date(),
        //     seen: false
        // });
        appActions.showNotification({
            type: 'info',
            message: `Tag ${tagObj.tag} published successfully`
        });
        listeningTags = listeningTags.splice(listeningTags.indexOf(tagObj.tag), 1);
        this.setState({
            listeningTags
        }, () => {
            tagActions.deletePendingTag(tagObj);
            transactionActions.deletePendingTx(tagObj.tx);
        });
    }
    render () {
        return null;
    }
}

TagPublisher.propTypes = {
    pendingTags: PropTypes.shape(),
    tagActions: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    transactionActions: PropTypes.shape(),
    appActions: PropTypes.shape()
};

function mapStateToProps (state) {
    return {
        loggedProfile: state.profileState.get('loggedProfile'),
        loggedProfileData: state.profileState.get('profiles').find(prf =>
            prf.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        pendingTags: state.tagState.get('pendingTags'),
        pendingTransactions: state.transactionState.get('pending'),
        minedTransactions: state.transactionState.get('mined')
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
