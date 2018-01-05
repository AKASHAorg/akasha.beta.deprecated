import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Modal, Button } from 'antd';
import { actionDelete, actionResetFundingRequirements } from '../../local-flux/actions/action-actions';

class FaucetAndManafyModal extends Component {
    state = {
        modalVisible: true
    }
    _getModalContent = () => {
        const { needEth, needAeth, needMana } = this.props;
        if (needMana && needAeth) {
            return <div>It seems you do not have aeth!</div>;
        }
        if (needEth) {
            return <div>It seems you are out of test ethers!</div>;
        }
        if (needMana && !needAeth && !needEth) {
            return <div>Please manafy some Aeth</div>;
        }
    }

    _handleModalCancel = () => {
        const { pendingActions } = this.props;
        pendingActions.forEach(action => this.props.actionDelete(action.get('id')));
        this.props.actionResetFundingRequirements();
    }

    _handleModalOk = () => {
        console.log('launch an action based on requirements');
        const { needEth, needAeth, needMana } = this.props;
        if (needMana && needAeth) {
            return console.log('Request AETH');
        }
        if (needEth) {
            return console.log('request test ethers');
        }
        if (needMana && !needAeth && !needEth) {
            return this.setState({
                modalVisible: false
            });
        }
    }

    _getModalTitle = () => {
        const { needEth, needAeth, needMana } = this.props;
        if (needMana && needAeth) {
            return <div>Request AKASHA Ethers!</div>;
        }
        if (needEth) {
            return <div>Request Test Ethers!</div>;
        }
        if (needMana && !needAeth && !needEth) {
            return <div>Manafy AETH</div>;
        }
    }
    render () {
        const { needAeth, needEth, needMana } = this.props;
        return (
          <div>
            <Modal
              visible={this.state.modalVisible}
              title={this._getModalTitle()}
              onOk={this._handleModalOk}
              onCancel={this._handleModalCancel}
              footer={[
                <Button key="back" onClick={this._handleModalCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={this._handleModalOk}>
                  {(needEth || (needAeth && needMana)) && 'Request AETH'}
                  {needMana && !needAeth && !needEth && 'Learn More'}
                </Button>,
              ]}
            >
              {this._getModalContent()}
            </Modal>
          </div>
        );
    }
}
FaucetAndManafyModal.propTypes = {
    actionDelete: PropTypes.func,
    actionResetFundingRequirements: PropTypes.func,
    needEth: PropTypes.bool,
    needAeth: PropTypes.bool,
    needMana: PropTypes.bool,
    pendingActions: PropTypes.shape(),
};

function mapStateToProps (state) {
    return {
        needEth: state.actionState.get('needEth'),
        needAeth: state.actionState.get('needAeth'),
        needMana: state.actionState.get('needMana'),
        pendingActions: state.actionState.get('byId'),
    };
}

export default connect(
    mapStateToProps,
    {
        actionDelete,
        actionResetFundingRequirements,
    }
)(injectIntl(FaucetAndManafyModal));
