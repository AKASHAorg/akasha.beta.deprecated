import React from 'react';
import { Dialog, FlatButton, SelectField, MenuItem } from 'material-ui';
import ArrowUpIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import ArrowDownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import style from './confirmation-dialog.scss';

class ConfirmationDialog extends React.PureComponent {
    getVoteWeights = () =>
      Array.from({ length: 10 }, (val, key) =>
        <MenuItem
          key={key}
          value={key + 1}
          primaryText={`${key + 1} votes`}
        />
    );
    getIcon = () => {
        const { isOpen } = this.props;
        const actionType = isOpen ? this.props.modalDetails.action : 'default';
        switch (actionType) {
            case 'upvote':
                return <ArrowUpIcon className={`col-xs-1 ${style.upvoteIcon}`} />;
            case 'downvote':
                return <ArrowDownIcon className={`col-xs-1 ${style.downvoteIcon}`} />;
            default:
                break;
        }
    };
    render () {
        const {
            isOpen,
            onCancel,
            onConfirm,
            onVoteWeightChange,
            voteWeight } = this.props;
        const modalDetails = this.props.modalDetails || {};
        const {
            title,
            subtitle,
            authorName,
            disclaimer,
            action,
            address } = modalDetails;

        const dialogActions = [
          <FlatButton
            label="Cancel"
            onTouchTap={ev => onCancel(ev)}
          />,
          <FlatButton
            label="Confirm"
            primary
            onTouchTap={
              ev => onConfirm(ev, action, address)
            }
          />
        ];

        return (
          <Dialog
            contentStyle={{ width: 420, maxWidth: 'none' }}
            modal
            title={
              <div style={{ fontSize: 24 }}>Vote</div>
            }
            open={isOpen}
            actions={dialogActions}
          >
            <div>{title}</div>
            {subtitle &&
              <small>{subtitle}</small>
            }
            {isOpen && (action === 'upvote' ||
              action === 'downvote') &&
              <div className="row middle-xs">
                {this.getIcon()}
                <div className="col-xs-11">
                  <SelectField
                    value={voteWeight}
                    fullWidth
                    onChange={onVoteWeightChange}
                  >
                    {this.getVoteWeights()}
                  </SelectField>
                </div>
                {isOpen && action === 'upvote' &&
                  <small>
                    {authorName} will receive
                    {voteWeight / 1000} ETH from your +{voteWeight} vote
                  </small>
                }
              </div>
            }
            <small>
              {disclaimer}
            </small>
          </Dialog>
        );
    }
}

ConfirmationDialog.propTypes = {
    isOpen: React.PropTypes.bool.isRequired,
    onCancel: React.PropTypes.func,
    onConfirm: React.PropTypes.func,
    onVoteWeightChange: React.PropTypes.func,
    voteWeight: React.PropTypes.number,
    modalDetails: React.PropTypes.shape({
        title: React.PropTypes.string.isRequired,
        subtitle: React.PropTypes.string,
        authorName: React.PropTypes.string,
        disclaimer: React.PropTypes.string.isrequired,
        action: React.PropTypes.string.isRequired,
        address: React.PropTypes.string
    })
};

export default ConfirmationDialog;
