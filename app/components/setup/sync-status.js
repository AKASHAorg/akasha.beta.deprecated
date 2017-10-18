import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { setupMessages } from '../../locale-data/messages';
import { SyncProgressLoader } from '../';

class SyncStatus extends Component {
    renderMessage (message) {
        const { intl } = this.props;
        return (
          <div className="sync-status__title">
            {intl.formatMessage(message)}
          </div>
        );
    }

    renderCounter = (current, total, message) => {
        if (!current || !total) {
            return null;
        }
        return (
          <div className="sync-status__counter">
            {message &&
              <span className="sync-status__counter-message">
                {message}
              </span>
            }
            {current} / {total}
          </div>
        );
    };

    renderProgressBody = () => { // eslint-disable-line complexity
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
                <div className="sync-status__title">
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
        } else if (gethStatus.get('downloading')) {
            return this.renderMessage(setupMessages.downloadingGeth);
        } else if (gethStatus.get('starting') || gethStarting) {
            return this.renderMessage(setupMessages.startingGeth);
        } else if (ipfsStatus.get('downloading')) {
            return this.renderMessage(setupMessages.downloadingIpfs);
        } else if (ipfsStatus.get('upgrading')) {
            return this.renderMessage(setupMessages.upgradingIpfs);
        } else if (syncActionId === 2 || syncActionId === 3) {
            const title = syncActionId === 2 ?
                setupMessages.syncPaused :
                setupMessages.syncStopped;

            return (
              <div>
                {this.renderMessage(title)}
                {this.renderCounter(gethSyncStatus.currentBlock, gethSyncStatus.highestBlock,
                      synchronizingMessage)}
                {this.renderCounter(gethSyncStatus.pulledStates, gethSyncStatus.knownStates,
                      processingMessage)}
              </div>
            );
        } else if (gethStatus.get('api')) {
            return this.renderMessage(setupMessages.findingPeers);
        } else if (!gethStatus.get('process') && !ipfsStatus.get('process')) {
            return this.renderMessage(setupMessages.launchingServices);
        }
        return this.renderMessage(setupMessages.waitingForServices);
    };

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
          <div className="sync-status">
            <div className="sync-status__progress-container">
              <SyncProgressLoader value={progress} />
            </div>
            <div className="sync-status__details">
              {this.renderProgressBody()}
            </div>
          </div>
        );
    }
}

SyncStatus.propTypes = {
    gethStarting: PropTypes.bool,
    gethStatus: PropTypes.shape().isRequired,
    gethSyncStatus: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    ipfsStatus: PropTypes.shape().isRequired,
    syncActionId: PropTypes.number
};

export default SyncStatus;
