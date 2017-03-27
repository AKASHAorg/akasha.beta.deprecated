import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { setupMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions
import { SyncProgressLoader } from 'shared-components';

const statusTextStyle = {
    fontWeight: 'bold',
    padding: '5px',
    fontSize: '18px'
};

class SyncStatusLoader extends Component {

    renderMessage (message) {
        const { intl } = this.props;
        return (
          <div style={statusTextStyle}>
            {intl.formatMessage(message)}
          </div>
        );
    }

    renderCounter (current, total, message) {
        if (!current || !total) {
            return null;
        }
        return (<div style={{ fontSize: '16px' }} >
          {message &&
            <span style={{ marginRight: '10px' }}>
              {message}
            </span>
          }
          <strong style={{ fontWeight: 'bold' }} >
            {current}
          </strong>/
          {total}
        </div>);
    }

    renderProgressBody () {
        const { gethStarting, gethStatus, gethSyncStatus, intl, ipfsStatus,
            syncActionId } = this.props;
        let peerInfo;
        const synchronizingMessage = intl.formatMessage(setupMessages.synchronizing);
        const processingMessage = intl.formatMessage(setupMessages.processing);

        if (gethSyncStatus && gethSyncStatus.get('peerCount') > 0 && gethSyncStatus.get('highestBlock') > 0) {
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
            return (
              <div>
                <div style={statusTextStyle}>
                  {peerInfo}
                </div>
                {this.renderCounter(gethSyncStatus.currentBlock, gethSyncStatus.highestBlock,
                  synchronizingMessage)}
                {this.renderCounter(gethSyncStatus.pulledStates, gethSyncStatus.knownStates,
                  processingMessage)}
              </div>
            );
        } else if (syncActionId === 4) {
            return this.renderMessage(setupMessages.syncCompleted);
        } else if (gethStatus.get('upgrading')) {
            return this.renderMessage(setupMessages.upgradingGeth);
        } else if (gethStatus.get('starting') || gethStarting) {
            return this.renderMessage(setupMessages.startingGeth);
        } else if (gethStatus.get('downloading')) {
            return this.renderMessage(setupMessages.downloadingGeth);
        } else if (ipfsStatus.get('downloading')) {
            return this.renderMessage(setupMessages.downloadingIpfs);
        } else if (syncActionId === 2 || syncActionId === 3) {
            return (
              <div>
                {this.renderMessage(setupMessages.disconnected)}
                {this.renderCounter(gethSyncStatus.currentBlock, gethSyncStatus.highestBlock,
                      synchronizingMessage)}
                {this.renderCounter(gethSyncStatus.pulledStates, gethSyncStatus.knownStates,
                      processingMessage)}
              </div>
            );
        } else if (gethStatus.get('api')) {
            return this.renderMessage(setupMessages.findingPeers);
        } else if (!gethStatus.get('api') && !ipfsStatus.get('spawned')) {
            return this.renderMessage(setupMessages.launchingServices);
        }
        return this.renderMessage(setupMessages.waitingForServices);
    }

    render () {
        const { gethSyncStatus, syncActionId } = this.props;
        let blockProgress;
        let currentProgress;

        if (gethSyncStatus && gethSyncStatus.get('peerCount') > 0 &&
                gethSyncStatus.get('highestBlock') > 0) {
            blockProgress = gethSyncStatus;
            currentProgress = ((blockProgress.get('currentBlock') - blockProgress.get('startingBlock')) /
                (blockProgress.get('highestBlock') - blockProgress.get('startingBlock'))) * 100;
        } else if (syncActionId === 4) {
            currentProgress = 100;
        }

        return (
          <div style={{ padding: '32px 0', textAlign: 'center' }} >
            <SyncProgressLoader value={currentProgress} />
            {this.renderProgressBody()}
          </div>
        );
    }
}

SyncStatusLoader.propTypes = {
    gethStarting: PropTypes.bool,
    gethStatus: PropTypes.shape().isRequired,
    gethSyncStatus: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    ipfsStatus: PropTypes.shape().isRequired,
    syncActionId: PropTypes.number
};

export default SyncStatusLoader;
