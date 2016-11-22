import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { AppActions, EntryActions, TagActions, TransactionActions } from 'local-flux';

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
            tagActions.getPendingTags(loggedProfile.get('profile'));
        }
    }
    componentWillReceiveProps (nextProps) {
        const { pendingTags, loggedProfile, minedTx, appActions } = nextProps;
        const { registerRequestedTags, listeningTags } = this.state;
        const tokenIsValid = this._checkTokenValidity(loggedProfile.get('expiration'));

        this.launchActions(nextProps);
        this.listenForMinedTx(nextProps);

        if (pendingTags.size === 0) return;
        for (let i = pendingTags.size - 1; i >= 0; i -= 1) {
            const tagObj = pendingTags.get(i);
            if (tagObj.error) { continue; } // eslint-disable-line no-continue
            if (tagObj.publishConfirmed) {
                appActions.hidePublishConfirmDialog();
            }
            if (tagObj.tx &&
                minedTransactions.findIndex(minedTx => minedTx.tx === tagObj.tx) !== -1) {
                this._deletePendingTag(tagObj);
                continue; // eslint-disable-line no-continue
            }
            if (tagObj.tx && listeningTags.indexOf(tagObj.tag) === -1) {
                this._listenTagTx(tagObj);
                listeningTags.push(tagObj.tag);
                continue; // eslint-disable-line no-continue
            }
            if (!tagObj.publishConfirmed && !tagObj.tx) {
                appActions.showPublishConfirmDialog({
                    type: 'tag',
                    ...tagObj
                });
            } else if (!tokenIsValid && registerRequestedTags.indexOf(tagObj.tag) === -1) {
                appActions.showAuthDialog();
            } else if (!tagObj.tx && tokenIsValid &&
                registerRequestedTags.indexOf(tagObj.tag) === -1) {
                this._registerTag(tagObj, loggedProfile);
                registerRequestedTags.push(tagObj.tag);
            }
        }
    }

    launchActions = (nextProps) => {
        const { pendingActions, appActions, tagActions } = nextProps;
        const actions = pendingActions.filter(action =>
            action.get('status') === 'readyToPublish');
        if (actions.size > 0) {
            actions.forEach(action => {
                const actionType = action.get('type');
                switch (actionType) {
                    case 'subscribeTag':
                        appActions.updatePendingAction(action.merge({
                            status: 'publishing'
                        }));
                        tagActions.subscribeTag(
                            action.getIn(['payload', 'tagName']), action.get('gas')
                        );
                        break;
                    case 'unsubscribeTag':
                        appActions.updatePendingAction(action.merge({
                            status: 'publishing'
                        }));
                        tagActions.unsubscribeTag(
                            action.getIn(['payload', 'tagName']), action.get('gas')
                        );
                        break;
                    default:
                        break;
                }
            });
        }
    };

    listenForMinedTx = (nextProps) => {
        const { minedTx, pendingTx, fetchingMined, fetchingPending, deletingPendingTx, appActions,
            entryActions, transactionActions, tagActions, loggedProfile,
            pendingActions } = nextProps;
        const isNotFetching = !fetchingMined && !fetchingPending;
        const pendingSubsTxs = isNotFetching ?
            pendingTx.toJS().filter(tx =>
                tx.profile === loggedProfile.get('profile') && (tx.type === 'subscribeTag' ||
                    tx.type === 'unsubscribeTag')
            ) :
            [];

        pendingSubsTxs.forEach((tx) => {
            const isMined = minedTx.find(mined => mined.tx === tx.tx);
            if (isMined && !deletingPendingTx) {
                const correspondingAction = pendingActions.find(action =>
                    action.get('type') === tx.type && action.get('status') === 'publishing');
                transactionActions.listenForMinedTx({ watch: false });
                transactionActions.deletePendingTx(tx.tx);
                tx.type === 'subscribeTag' ?
                    tagActions.subscribeTagSuccess(tx.tagName) :
                    tagActions.unsubscribeTagSuccess(tx.tagName)
                appActions.deletePendingAction(correspondingAction.get('id'));
                entryActions.getEntriesStream(loggedProfile.get('akashaId'));
            }
        });
    };

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
            id: 'tagPublishedSuccessfully',
            values: { tagName: tagObj.tag }
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
    fetchingMined: PropTypes.bool,
    fetchingPending: PropTypes.bool,
    deletingPendingTx: PropTypes.bool,
    pendingActions: PropTypes.shape(),
    pendingTags: PropTypes.shape(),
    tagActions: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    transactionActions: PropTypes.shape(),
    appActions: PropTypes.shape(),
    entryActions: PropTypes.shape()
};

function mapStateToProps (state) {
    return {
        fetchingMined: state.transactionState.get('fetchingMined'),
        fetchingPending: state.transactionState.get('fetchingPending'),
        deletingPendingTx: state.transactionState.getIn(['flags', 'deletingPendingTx']),
        loggedProfile: state.profileState.get('loggedProfile'),
        loggedProfileData: state.profileState.get('profiles').find(prf =>
            prf.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        pendingActions: state.appState.get('pendingActions'),
        pendingTags: state.tagState.get('pendingTags'),
        pendingTx: state.transactionState.get('pending'),
        minedTx: state.transactionState.get('mined')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        entryActions: new EntryActions(dispatch),
        tagActions: new TagActions(dispatch),
        transactionActions: new TransactionActions(dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TagPublisher);
