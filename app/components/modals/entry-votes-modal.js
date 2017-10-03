import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Modal, Tooltip } from 'antd';
import classNames from 'classnames';
import { entryMessages } from '../../locale-data/messages';
import { DataLoader } from '../';
import { EntryDownvote, EntryUpvote, ToolbarVotes } from '../svg';

const serverChannel = global.Channel.server.entry.votesIterator;
const clientChannel = global.Channel.client.entry.votesIterator;

class EntryVotesModal extends Component {
    constructor (props) {
        super(props);

        serverChannel.enable();
        clientChannel.on(this.updateVotes);
        this.state = {
            fetchingVotes: true,
            votes: []
        };
    }

    componentDidMount () {
        const { entryId } = this.props;
        serverChannel.send({ entryId });
    }

    componentWillUnmount () {
        clientChannel.removeListener(this.updateVotes);
    }

    updateVotes = (ev, response) => {
        this.setState({
            fetchingVotes: false,
            votes: response.data.collection
        });
    };

    render () {
        const { closeVotesPanel, entryTitle, intl } = this.props;
        const { fetchingVotes, votes } = this.state;

        return (
          <Modal
            closable={false}
            footer={null}
            onCancel={closeVotesPanel}
            title={
              <Tooltip title={entryTitle}>
                <div className="flex-center-y entry-votes-modal__header">
                  <svg className="entry-votes-modal__title-icon" viewBox="0 0 16 16">
                    <ToolbarVotes />
                  </svg>
                  <span className="overflow-ellipsis entry-votes-modal__title">
                    {entryTitle}
                  </span>
                </div>
              </Tooltip>
            }
            visible
            width={320}
            wrapClassName="entry-votes-modal"
          >
            {votes.length > 0 &&
              <div className="entry-votes-modal__list">
                {votes.map((vote) => {
                    const weight = parseInt(vote.score, 10);
                    const url = `/@${vote.akashaId}`;
                    const iconClass = classNames('entry-votes-modal__vote-icon', {
                        'entry-votes-modal__vote-icon_downvote': weight < 0,
                        'entry-votes-modal__vote-icon_upvote': weight > 0
                    });
                    return (
                      <Link className="unstyled-link" to={url}>
                        <div
                          className="flex-center-y entry-votes-modal__row"
                          key={vote.akashaId}
                        >
                          <svg className={iconClass} viewBox="0 0 20 20">
                            {weight < 0 ?
                              <EntryDownvote /> :
                              <EntryUpvote />
                            }
                          </svg>
                          <span className="overflow-ellipsis entry-votes-modal__voter">
                            @{vote.akashaId}
                          </span>
                          <span className="entry-votes-modal__weight">
                            {vote.score}
                          </span>
                        </div>
                      </Link>
                    );
                })}
              </div>
            }
            {votes.length === 0 && !fetchingVotes &&
              <div className="flex-center entry-votes-modal__placeholder">
                {intl.formatMessage(entryMessages.noVotes)}
              </div>
            }
            {fetchingVotes &&
              <div className="flex-center entry-votes-modal__placeholder">
                <DataLoader flag />
              </div>
            }
          </Modal>
        );
    }

}

EntryVotesModal.propTypes = {
    closeVotesPanel: PropTypes.func.isRequired,
    entryId: PropTypes.string.isRequired,
    entryTitle: PropTypes.string.isRequired,
    intl: PropTypes.shape().isRequired,
};

export default injectIntl(EntryVotesModal);
