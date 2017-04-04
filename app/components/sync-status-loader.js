import React, { Component, PropTypes } from 'react';
import { setupMessages } from '../locale-data/messages';
import { SyncProgressLoader } from '../shared-components';

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
        return (
          <div style={{ fontSize: '16px' }} >
            {message &&
              <span style={{ marginRight: '10px' }}>
                {message}
              </span>
            }
            <strong>{current}</strong>/{total}
          </div>
        );
    }

    renderProgressBody () {
        const { gethStarting, gethStatus, gethSyncStatus, intl, ipfsStatus,
            syncActionId } = this.props;
        const synchronizingMessage = intl.formatMessage(setupMessages.synchronizing);
        const processingMessage = intl.formatMessage(setupMessages.processing);

        if (gethSyncStatus && gethSyncStatus.get('peerCount') > 0 &&
                gethSyncStatus.get('highestBlock') > 0) {
            const peerInfo = intl.formatMessage(
                setupMessages.peerCount,
                {
                    peerCount: gethSyncStatus.get('peerCount')
                }
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
        let progress;

        if (gethSyncStatus && gethSyncStatus.get('peerCount') > 0 &&
                gethSyncStatus.get('highestBlock') > 0) {
            const { currentBlock, startingBlock, highestBlock } = gethSyncStatus.toJS();
            progress = ((currentBlock - startingBlock) / (highestBlock - startingBlock)) * 100;
        } else if (syncActionId === 4) {
            progress = 100;
        }

        return (
          <div style={{ padding: '32px 0', textAlign: 'center' }} >
            <SyncProgressLoader value={progress} />
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
