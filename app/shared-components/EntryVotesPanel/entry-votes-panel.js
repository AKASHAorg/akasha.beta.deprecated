import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { Dialog, List, ListItem, SvgIcon } from 'material-ui';
import { EntryDownvote, EntryUpvote, ToolbarVotes } from '../../components/svg';

const serverChannel = global.Channel.server.entry.votesIterator;
const clientChannel = global.Channel.client.entry.votesIterator;

class EntryVotesPanel extends Component {
    constructor (props) {
        super(props);

        serverChannel.enable();
        clientChannel.on(this.updateVotes);
        this.state = {
            fetchingVotes: false,
            votes: []
        };
    }

    componentDidMount () {
        const { entryId } = this.props;
        serverChannel.send({ entryId });
        ReactTooltip.rebuild();
    }

    componentWillUnmount () {
        clientChannel.removeListener(this.updateVotes);
    }

    updateVotes = (ev, response) => {
        this.setState({
            votes: response.data.collection
        });
    };

    selectProfile = (profileAddress) => {
        const { router } = this.context;
        router.push(`/${router.params.akashaId}/profile/${profileAddress}`);
    }

    render () {
        const { closeVotesPanel, entryTitle } = this.props;
        const { palette } = this.context.muiTheme;

        return (
          <Dialog
            contentStyle={{ maxWidth: 300 }}
            title={
              <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '40px' }}>
                <SvgIcon viewBox="0 0 16 16" style={{ marginRight: '14px', flex: '0 0 auto' }}>
                  <ToolbarVotes />
                </SvgIcon>
                <span
                  style={{ display: 'inline-block', textOverflow: 'ellipsis', overflowX: 'hidden' }}
                  data-tip={entryTitle && entryTitle.slice(0, 60)}
                >
                  {entryTitle}
                </span>
              </div>
            }
            titleStyle={{ overflowX: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            open
            onRequestClose={closeVotesPanel}
            autoScrollBodyContent
          >
            {this.state.votes.length > 0 &&
              <List>
                {this.state.votes.map((vote, key) =>
                  <ListItem
                    key={key}
                    leftIcon={
                      <SvgIcon
                        viewBox="0 0 20 20"
                        style={{
                            width: '20px',
                            height: '20px',
                            margin: '14px',
                            fill: parseInt(vote.score, 10) < 0 ?
                                palette.accent1Color :
                                palette.accent3Color
                        }}
                      >
                        {parseInt(vote.score, 10) < 0 ?
                          <EntryDownvote /> :
                          <EntryUpvote />
                        }
                      </SvgIcon>
                    }
                    innerDivStyle={{ paddingLeft: '50px' }}
                    onClick={() => this.selectProfile(vote.profileAddress)}
                  >
                    <div style={{ display: 'flex' }}>
                      <span
                        style={{
                            paddingRight: '15px',
                            width: '150px',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden'
                        }}
                      >
                        @{vote.akashaId}
                      </span>
                      <span style={{ width: '35px', textAlign: 'right' }}>
                        {vote.score}
                      </span>
                    </div>
                  </ListItem>
                )}
              </List>
            }
            {this.state.votes.length === 0 &&
              <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    color: palette.disabledColor,
                    paddingTop: '10px'
                }}
              >
                No votes
              </div>
            }
          </Dialog>
        );
    }

}

EntryVotesPanel.propTypes = {
    closeVotesPanel: PropTypes.func.isRequired,
    entryId: PropTypes.string.isRequired,
    entryTitle: PropTypes.string.isRequired
};

EntryVotesPanel.contextTypes = {
    muiTheme: PropTypes.shape(),
    router: PropTypes.shape()
};

export default EntryVotesPanel;
