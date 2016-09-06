import React from 'react';
import { Dialog, FlatButton, SelectField, MenuItem } from 'material-ui';
import ArrowUpIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-up';

const ConfirmationDialog = (props) => {
    const confirmAction = props.isOpen ? props.modalDetails.action : null;
    const dialogActions = [
      <FlatButton
        label="Cancel"
        onTouchTap={ev => props.onCancel(ev)}
      />,
      <FlatButton
        label="Confirm"
        primary
        onTouchTap={
          ev => props.onConfirm(ev, props.modalDetails.action, props.modalDetails.address)
        }
      />
    ];
    const getVoteWeights = () => {
        const voteWeights = Array.apply(null, { length: 10 }).map(Number.call, Number);
        return voteWeights.map((vote, key) => {
            return (
              <MenuItem
                key={key}
                value={key + 1}
                label={`${(key + 1) / 10}`}
                primaryText={`${key + 1} votes`}
              />
            );
        });
    };

    return (
      <Dialog
        contentStyle={{ width: 420, maxWidth: 'none' }}
        modal
        title={<h1>Vote</h1>}
        open={props.isOpen}
        actions={dialogActions}
      >
        <div>Entry name</div>
        <small>by Adrian Baiu</small>
        <div>
          <SelectField
            style={{ width: '100%' }}
            value={props.voteWeight}
            onChange={props.onVoteWeightChange}
          >
            {getVoteWeights()}
          </SelectField>
          <small>Cristi Nelutu Grigore will receive {props.voteWeight / 1000} ETH from your +{props.voteWeight} vote</small>
        </div>
        <small>By proceeding to vote this entry, you agree with the 0.005 ETH
        fee which will be deducted from your 0.02 ETH balance</small>
      </Dialog>
    );
};

ConfirmationDialog.propTypes = {
    isOpen: React.PropTypes.bool.isRequired,
    onCancel: React.PropTypes.func,
    onConfirm: React.PropTypes.func,
    onVoteWeightChange: React.PropTypes.func,
    voteWeight: React.PropTypes.number,
    modalDetails: React.PropTypes.object
};

export default ConfirmationDialog;
