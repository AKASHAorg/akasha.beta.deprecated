import React from 'react';
import PanelContainer from 'shared-components/PanelContainer/panel-container';
import { CircularProgress, RaisedButton } from 'material-ui';

class PublishEntryStatus extends React.Component {
    // componentDidMount () {
    //     const { entryActions, entryState, profileState } = this.props;
    //     const draftToPublish = entryState.get('drafts').find(draft =>
    //         draft.id === parseInt(this.props.params.draftId, 10));
    //     entryActions.publishEntry(
    //         draftToPublish.toJS(),
    //         profileState.get('loggedProfile').get('address')
    //     );
    // }
    _handleConfirmation = () => {
        const { draftActions, params } = this.props;
        draftActions.updateDraft({
            id: parseInt(params.draftId, 10),
            status: {
                currentAction: 'checkLogin',
                publishing: true,
                publishingConfirmed: true
            }
        });
    }
    _approximateFees = (draft) => {
        return {
            tagPublishingFees: 0.2,
            extraTagFees: 0.02,
            entryFee: 0.01
        };
    }
    _handleCancel = () => {
        const { params } = this.props;
        this.context.router.push(`/${params.akashaId}/stream`);
    }
    render () {
        const { drafts, params } = this.props;
        const draftToPublish = drafts.find(draft =>
          draft.id === parseInt(params.draftId, 10));
        return (
          <PanelContainer
            showBorder
            title="Publishing entry"
            style={{
                left: '50%',
                marginLeft: '-320px',
                position: 'absolute',
                top: 0,
                bottom: 0,
                zIndex: 16
            }}
          >
            <div className="col-xs-12" style={{ paddingTop: 32 }}>
              {!draftToPublish &&
                <div>Finding draft.. Please wait.</div>
              }
              {draftToPublish && !draftToPublish.get('status').publishingConfirmed &&
                <div className="row">
                  <div className="col-xs-12 start-xs">
                    <h3>Confirm Publishing</h3>
                    <p>Please confirm publishing of the article
                      <b> &quot;{draftToPublish.get('title')}&quot;</b>
                    </p>
                    <p>Fees:</p>
                    <p>Tags fee: {this._approximateFees(draftToPublish).tagPublishingFees} ETH</p>
                    <p>Extra Tag fees: {this._approximateFees(draftToPublish).extraTagFees} ETH</p>
                    <p>
                      Entry Publishing Fees: {this._approximateFees(draftToPublish).entryFee} ETH
                    </p>
                    <RaisedButton
                      label="Cancel"
                      onTouchTap={this._handleCancel}
                    />
                    <RaisedButton
                      label="Confirm"
                      onTouchTap={this._handleConfirmation}
                      primary
                    />
                  </div>
                </div>
              }
              {draftToPublish && draftToPublish.get('status').publishingConfirmed &&
                <div className="row">
                  <div className="col-xs-12 center-xs">
                    <CircularProgress size={80} />
                  </div>
                  <div className="col-xs-12 center-xs" style={{ paddingTop: 16 }}>
                    <h3>Status of the entry..</h3>
                    <p>This entry is being published.</p>
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
    drafts: React.PropTypes.shape()
};
PublishEntryStatus.contextTypes = {
    router: React.PropTypes.shape()
}
export default PublishEntryStatus;
