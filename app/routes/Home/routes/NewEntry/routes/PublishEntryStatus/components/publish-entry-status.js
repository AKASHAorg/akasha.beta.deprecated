import React from 'react';
import PanelContainer from 'shared-components/PanelContainer/panel-container'; // eslint-disable-line import/no-unresolved, import/extensions
import { CircularProgress, RaisedButton } from 'material-ui';

class PublishEntryStatus extends React.Component {
    componentDidMount () {
        document.body.style.overflow = 'hidden';
    }
    componentWillReceiveProps (nextProps) {
        const { drafts, params, pendingActions } = nextProps;
        const currentDraft = drafts.find(draft => draft.id === parseInt(params.draftId, 10));
        const currentDraftAction = pendingActions.find(action =>
            action.toJS().payload.draft.id === parseInt(params.draftId, 10)
        );
        const prevDraft = this.props.drafts.find(draft =>
            draft.id === parseInt(params.draftId, 10));
        if ((prevDraft && !currentDraft) || !currentDraftAction) {
            this.context.router.push(`/${params.akashaId}/explore/tag`);
        }
    }
    shouldComponentUpdate (nextProps) {
        const { drafts, params, pendingActions } = nextProps;
        const currentDraft = drafts.find(draft => draft.id === parseInt(params.draftId, 10));
        const prevCurrentDraft = this.props.drafts.find(draft =>
            draft.id === parseInt(params.draftId, 10)
        );
        return prevCurrentDraft !== currentDraft ||
            pendingActions !== this.props.pendingActions;
    }
    componentWillUnmount () {
        document.body.style.overflow = 'initial';
    }
    _handleReturn = () => {
        const { params } = this.props;
        const { router } = this.context;
        router.push(`/${params.akashaId}/explore/tag`);
    }
    _getCurrentAction = () => { // eslint-disable-line consistent-return
        const { pendingActions, params } = this.props;
        const currentDraftAction = pendingActions.find(action =>
            action.toJS().payload.draft.id === parseInt(params.draftId, 10)
        );
        switch (currentDraftAction.toJS().status) {
            case 'needConfirmation':
                return 'Waiting for publish confirmation!';
            case 'checkAuth':
                return 'Waiting for re-authentication!';
            case 'publishing':
                return 'Receiving transaction id';
            case 'publishComplete':
                return 'Publish complete. Redirecting...';
            default:
                break;
        }
    }
    render () {
        const { drafts, params, draftErrors } = this.props;
        const draftToPublish = drafts.find(draft =>
        draft.id === parseInt(params.draftId, 10));


        return (
          <PanelContainer
            showBorder
            title="Publishing entry"
            actions={[
                /* eslint-disable */
                <RaisedButton key="back-to-stream" label="Back to Home" primary onClick={this._handleReturn} />
                /* eslint-enable */
            ]}
            style={{
                left: '50%',
                marginLeft: '-320px',
                position: 'fixed',
                top: 0,
                bottom: 0,
                zIndex: 16
            }}
          >
            <div className="col-xs-12" style={{ paddingTop: 32 }}>
              {!draftToPublish &&
                <div>Finding draft.. Please wait.</div>
              }
              {draftToPublish &&
                <div className="row" style={{ height: '100%' }}>
                  <div className="col-xs-12 center-xs" style={{ paddingTop: 64 }}>
                    <CircularProgress size={80} />
                  </div>
                  <div className="col-xs-12 center-xs">
                    <h3>Publishing &quot;{draftToPublish.getIn(['content', 'title'])}&quot;</h3>
                    <p>Current Action: {this._getCurrentAction()}</p>
                    <p>This entry is being published. You can return to home.</p>
                    {(draftErrors.size > 0) &&
                        draftErrors.map((err, key) =>
                          <div key={key} style={{ color: 'red' }}>
                            Error {err.get('code') && err.get('code')}: {err.get('message')}
                          </div>
                        )
                    }
                  </div>
                </div>
               }
            </div>
          </PanelContainer>
        );
    }
}
PublishEntryStatus.propTypes = {
    params: React.PropTypes.shape(),
    drafts: React.PropTypes.shape(),
    draftErrors: React.PropTypes.shape(),
    pendingActions: React.PropTypes.shape()
};
PublishEntryStatus.contextTypes = {
    router: React.PropTypes.shape()
};
export default PublishEntryStatus;
