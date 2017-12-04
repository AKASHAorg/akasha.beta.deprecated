import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import classNames from 'classnames';
import { entryMessages } from '../../locale-data/messages';
import { DataLoader, Icon } from '../';
import { getDisplayName } from '../../utils/dataModule';
import { ToolbarVotes } from '../svg';

const serverChannel = global.Channel.server.entry.votesIterator;
const clientChannel = global.Channel.client.entry.votesIterator;

class EntryVotesModal extends Component {
    constructor (props) {
        super(props);

        serverChannel.enable();
        clientChannel.on(this.updateVotes);
        this.state = {
            fetchingVotes: true,
            votes: [],
            lastBlock: this.props.blockNr
        };
    }

    componentDidMount () {
        const { blockNr, content } = this.props;
        if (content.commentId) {
            serverChannel.send({ toBlock: blockNr, commentId: content.commentId });
            return;
        }
        serverChannel.send({ toBlock: blockNr, entryId: content.entryId });
    }

    componentWillUnmount () {
        clientChannel.removeListener(this.updateVotes);
    }

    updateVotes = (ev, response) => {
        const { content } = this.props;
        this.setState({
            fetchingVotes: false,
            votes: this.state.votes.concat(response.data.collection),
            lastBlock: response.data.lastBlock,
            lastIndex: response.data.lastIndex
        });
        if (this.state.lastBlock > 0) {
            this.setState({ fetchingVotes: true });
            if (content.commentId) {
                serverChannel.send({
                    toBlock: this.state.lastBlock,
                    commentId: content.commentId,
                    lastIndex: this.state.lastIndex
                });
                return;
            }
            serverChannel.send({
                toBlock: this.state.lastBlock,
                entryId: content.entryId,
                lastIndex: this.state.lastIndex
            });
        }
    };

    render () {
        const { closeVotesPanel, contentTitle, intl } = this.props;
        const { fetchingVotes, votes } = this.state;

        return (
          <Modal
            closable={false}
            footer={null}
            onCancel={closeVotesPanel}
            title={
              <div className="flex-center-y votes-modal__header">
                <svg className="votes-modal__title-icon" viewBox="0 0 16 16">
                  <ToolbarVotes />
                </svg>
                <span className="overflow-ellipsis votes-modal__title">
                  {contentTitle}
                </span>
              </div>
            }
            visible
            width={320}
            wrapClassName="votes-modal"
          >
            {votes && votes.length > 0 &&
              <div className="votes-modal__list">
                {votes.map((vote) => {
                    const weight = vote.weight;
                    const url = `/${vote.ethAddress}`;
                    const iconClass = classNames('votes-modal__vote-icon', {
                        'votes-modal__vote-icon_downvote': weight < 0,
                        'votes-modal__vote-icon_upvote': weight > 0
                    });
                    return (
                      <Link className="unstyled-link" key={vote.ethAddress} to={url}>
                        <div className="flex-center-y votes-modal__row">
                          <Icon
                            className={iconClass}
                            type={weight < 0 ? 'arrowDown' : 'arrowUp'}
                          />
                          <span className="overflow-ellipsis votes-modal__voter">
                            {getDisplayName({ akashaId: vote.akashaId, ethAddress: vote.ethAddress, long: true })}
                          </span>
                          <span className="votes-modal__weight">
                            {vote.weight}
                          </span>
                        </div>
                      </Link>
                    );
                })}
              </div>
            }
            {votes && votes.length === 0 && !fetchingVotes &&
              <div className="flex-center votes-modal__placeholder">
                {intl.formatMessage(entryMessages.noVotes)}
              </div>
            }
            {fetchingVotes &&
              <div className="flex-center votes-modal__placeholder">
                <DataLoader flag />
              </div>
            }
          </Modal>
        );
    }
}

EntryVotesModal.propTypes = {
    blockNr: PropTypes.number,
    closeVotesPanel: PropTypes.func.isRequired,
    content: PropTypes.shape().isRequired,
    contentTitle: PropTypes.string.isRequired,
    intl: PropTypes.shape().isRequired,
};

export default injectIntl(EntryVotesModal);
