import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { setupMessages } from 'locale-data/messages'; /* eslint import/no-unresolved: 0 */
import { SyncProgressLoader } from 'shared-components';

class SyncStatus extends Component {

    renderCounter(current, total, message) {
        if (!current || !total) {
          return null;
        }
        return <div style={{ fontSize: '16px' }} >
          {message &&
            <span style={{ marginRight: '10px' }}>
              {message}
            </span>
          }
          <strong style={{ fontWeight: 'bold' }} >
            {current}
          </strong>/
          {total}
        </div>;
    }

    render () {
        const { intl, gethSyncStatus, gethStatus, ipfsStatus, syncActionId } = this.props;
        let blockProgress;
        let currentProgress;
        let progressBody;
        let peerInfo;
        const synchronizingMessage = intl.formatMessage(setupMessages.synchronizing);
        const processingMessage = intl.formatMessage(setupMessages.processing);

        if (gethSyncStatus && gethSyncStatus.get('peerCount') > 0 && gethSyncStatus.get('highestBlock') > 0) {
            blockProgress = gethSyncStatus;
            currentProgress = ((blockProgress.get('currentBlock') - blockProgress.get('startingBlock')) /
                (blockProgress.get('highestBlock') - blockProgress.get('startingBlock'))) * 100;
            peerInfo = (
              <FormattedMessage
                id="app.setup.peerCount"
                description="counting connected peers"
                defaultMessage={`{peerCount, number} {peerCount, plural,
                    one {peer}
                    few {peers}
                    many {peers}
                    other {peers}
                }, {peerCount, plural,
                    one {connected}
                    other {connected}
                }`}
                values={{ peerCount: gethSyncStatus.get('peerCount') }}
              />
            );
            progressBody = (
              <div>
                <div style={statusTextStyle} >
                  {peerInfo}
                </div>
                {this.renderCounter(blockProgress.currentBlock, blockProgress.highestBlock,
                  synchronizingMessage)}
                {this.renderCounter(gethSyncStatus.pulledStates, gethSyncStatus.knownStates,
                  processingMessage)}
              </div>
            );
        } else {
            if (syncActionId === 4) {
                currentProgress = 100;
                progressBody = (
                  <div>
                    <div style={statusTextStyle} >
                      {intl.formatMessage(setupMessages.syncCompleted)}
                    </div>
                  </div>
                );
            } else if (gethStatus.get('starting')) {
                progressBody = (
                  <div>
                    <div style={statusTextStyle} >
                      {intl.formatMessage(setupMessages.startingGeth)}
                    </div>
                  </div>
                );
            } else if (gethStatus.get('downloading')) {
                progressBody = (
                  <div>
                    <div style={statusTextStyle} >
                      {intl.formatMessage(setupMessages.downloadingGeth)}
                    </div>
                  </div>
                );
            } else if (ipfsStatus.get('downloading')) {
                progressBody = (
                  <div>
                    <div>
                      <div style={statusTextStyle} >
                        {intl.formatMessage(setupMessages.downloadingIpfs)}
                      </div>
                    </div>
                  </div>
                );
            } else if (syncActionId === 2 || syncActionId === 3) {
                progressBody = (
                  <div>
                    <div style={statusTextStyle} >
                      {intl.formatMessage(setupMessages.disconnected)}
                    </div>
                    {this.renderCounter(gethSyncStatus.currentBlock, gethSyncStatus.highestBlock,
                      synchronizingMessage)}
                    {this.renderCounter(gethSyncStatus.pulledStates, gethSyncStatus.knownStates,
                      processingMessage)}
                  </div>
                );
            } else if (gethSyncStatus.get('peerCount') === 0) {
                peerInfo = intl.formatMessage(setupMessages.findingPeers);
                progressBody = (
                  <div>
                    <div style={statusTextStyle} >
                      {peerInfo}
                    </div>
                  </div>
                );
            } else {
                progressBody = (
                  <div>
                    <div style={statusTextStyle} >
                      {intl.formatMessage(setupMessages.waitingForBlock)}
                    </div>
                  </div>
                );
            }
        }
        return (
          <div style={{ padding: '32px 0', textAlign: 'center' }} >
            <SyncProgressLoader value={currentProgress} />
            {progressBody}
          </div>
        );
    }
}

SyncStatus.propTypes = {
    intl: PropTypes.shape().isRequired,
    gethSyncStatus: PropTypes.shape().isRequired,
    gethStatus: PropTypes.shape().isRequired,
    ipfsStatus: PropTypes.shape().isRequired,
    syncActionId: PropTypes.number
};

const statusTextStyle = {
    fontWeight: 'bold',
    padding: '5px',
    fontSize: '18px'
};

export default SyncStatus;
