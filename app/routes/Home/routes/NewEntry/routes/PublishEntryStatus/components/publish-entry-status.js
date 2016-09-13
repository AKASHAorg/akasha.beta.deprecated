import React from 'react';
import PanelContainer from 'shared-components/PanelContainer/panel-container';
import { CircularProgress } from 'material-ui';

class PublishEntryStatus extends React.Component {
    constructor (props) {
        super(props);
    }
    componentDidMount () {
        const { entryActions, entryState, profileState } = this.props;
        const draftToPublish = entryState.get('drafts').find(draft =>
            draft.id === parseInt(this.props.params.draftId, 10));
        entryActions.publishEntry(
            draftToPublish.toJS(),
            profileState.get('loggedProfile').get('address')
        );
    }
    render () {
        const { entryState } = this.props;
        const draftToPublish = entryState.get('drafts').find(draft =>
        draft.id === parseInt(this.props.params.draftId, 10));
        
        return (
          <PanelContainer
            showBorder
            title="Publishing entry"
            style={{
                left: '50%',
                marginLeft: '-320px',
                position: 'absolute',
                top: 0,
                bottom: 0
            }}
          >
            <div className="col-xs-12" style={{ paddingTop: 32 }}>
              <div className="row">
                <div className="col-xs-12 center-xs">
                  <CircularProgress size={1} />
                </div>
                <div className="col-xs-12 center-xs" style={{ paddingTop: 16 }}>
                  <h3>Status of the entry..</h3>
                  <p>This entry is being published.</p>
                </div>
              </div>
            </div>
          </PanelContainer>
        );
    }
}
PublishEntryStatus.propTypes = {};
export default PublishEntryStatus;
