import React, {Component, PropTypes} from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { generalMessages, setupMessages } from 'locale-data/messages';
import { SyncProgressLoader } from 'shared-components';

class SyncStatus extends Component {

    render () {
        const { intl, gethSyncStatus, gethStatus } = this.props;
        let blockProgress;
        let currentProgress;
        let progressBody;
        let peerInfo;
        if (gethSyncStatus && gethSyncStatus.get('peerCount') > 0 && gethSyncStatus.get('highestBlock') > 0) {
            blockProgress = gethSyncStatus;
            currentProgress = ((blockProgress.get('currentBlock') - blockProgress.get('startingBlock')) /
                (blockProgress.get('highestBlock') - blockProgress.get('startingBlock'))) * 100;
            peerInfo = (
              <FormattedMessage
                id="app.setup.peerCount"
                deafultMessage={`{peerCount, number} {peerCount, plural,
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
                <div style={{ fontWeight: 'bold', padding: '5px', fontSize: '16px' }} >
                    {peerInfo}
                </div>
                <div style={{ fontSize: '20px' }} >
                  <strong style={{ fontWeight: 'bold' }} >
                    {blockProgress.currentBlock}
                  </strong>/
                    {blockProgress.highestBlock}
                </div>
              </div>
            );
        } else if (gethStatus.get('downloading')) {
            peerInfo = intl.formatMessage(setupMessages.downloadingGeth);
            progressBody = (
              <div>
                <div style={{ fontWeight: 'bold', padding: '5px', fontSize: '16px' }} >
                    {intl.formatMessage(setupMessages.downloadingGeth)}
                </div>
              </div>
            );
        } else if (gethStatus.get('starting')) {
            peerInfo = intl.formatMessage(setupMessages.startingGeth);
            progressBody = (
              <div>
                <div style={{ fontWeight: 'bold', padding: '5px', fontSize: '16px' }} >
                  {intl.formatMessage(setupMessages.startingGeth)}
                </div>
              </div>
            );
        } else {
            peerInfo = intl.formatMessage(setupMessages.findingPeers);
            progressBody = (
              <div>
                <div style={{ fontWeight: 'bold', padding: '5px', fontSize: '16px' }} >
                  {peerInfo}
                </div>
              </div>
            );
        }
        return (
          <div style={{ padding: '64px 0', textAlign: 'center' }} >
            <SyncProgressLoader value={currentProgress} />
            {progressBody}
          </div>
        );
    }
}

SyncStatus.propTypes = {

};

export default injectIntl(SyncStatus);
