import React from 'react';
import PanelContainer from 'shared-components/PanelContainer/panel-container';
import { CircularProgress, RaisedButton } from 'material-ui';

class PublishEntryStatus extends React.Component {
    componentWillReceiveProps (nextProps) {
        const { draftActions, drafts, params } = nextProps;
        const currentDraft = drafts.find(draft => draft.id === parseInt(params.draftId, 10));
        if (currentDraft.status.currentAction === 'confirmPublish') {
            draftActions.updateDraft({
                id: parseInt(params.draftId, 10),
                status: {
                    currentAction: 'checkLogin',
                    publishing: true,
                    publishingConfirmed: true
                }
            });
        }
    }
    _handleReturn = () => {
        const { params } = this.props;
        const { router } = this.context;
        router.push(`/${params.akashaId}/explore/stream`);
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
                <RaisedButton key="back-to-stream" label="Back to Stream" primary onClick={this._handleReturn} />
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
                    <h3>Publishing &quot;{draftToPublish.title}&quot;</h3>
                    <p>This entry is being published. You`ll be notified when it`s done.</p>
                    {(draftErrors.size > 0) &&
                        draftErrors.map(err =>
                          <div>Error {err.get('code') && err.get('code')}: {err.get('message')}</div>
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
    draftActions: React.PropTypes.shape(),
    params: React.PropTypes.shape(),
    drafts: React.PropTypes.shape(),
    draftErrors: React.PropTypes.shape()
};
PublishEntryStatus.contextTypes = {
    router: React.PropTypes.shape()
};
export default PublishEntryStatus;
