import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import QRCode from 'qrcode.react';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { selectBalance } from '../../local-flux/selectors';
import { generalMessages, profileMessages } from '../../locale-data/messages';

const Item = Form.Item;

class MyBalance extends Component {
    constructor (props) {
        super(props);
        this.state = {
            address: '',
            amount: ''
        };
    }

    handleAddressChange = (e) => {
        this.setState({ address: e.target.value });
    }

    handleAmountChange = (e) => {
        this.setState({ amount: e.target.value });
    }

    // handleSendTx = () => {

    // }

    render () {
        const { balance, intl, loggedProfile } = this.props;
        const userAddress = loggedProfile.get('profile');
        return (
          <div>
            <Row>
              <Card title={intl.formatMessage(profileMessages.myBalance)}>
                <div className="user-profile-details_balance">
                  <span className="balance-currency">ETH</span>
                  <span className="balance-value"> {balance}</span>
                </div>
              </Card>
            </Row>
            <Row>
              <Col span={12}>
                <Card title={intl.formatMessage(profileMessages.send)}>
                  <Form onSubmit={this.handleSendTx}>
                    <Item
                      label={intl.formatMessage(generalMessages.ethereumAddress)}
                    >
                      <Input
                        onChange={this.handleAddressChange}
                        value={this.state.address}
                      />
                    </Item>
                    <Item
                      label={intl.formatMessage(generalMessages.amount)}
                    >
                      <Input
                        onChange={this.handleAmountChange}
                        value={this.state.amount}
                      />
                    </Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={this.handleSendTx}
                    >
                      {intl.formatMessage(profileMessages.send)}
                    </Button>
                  </Form>
                </Card>
              </Col>
              <Col span={12}>
                <Card title={intl.formatMessage(profileMessages.receive)}>
                  <span>My address: {userAddress}</span>
                  <QRCode value={userAddress} />
                </Card>
              </Col>
            </Row>
          </div>
        );
    }
}

MyBalance.propTypes = {
    balance: PropTypes.string,
    intl: PropTypes.shape(),
    loggedProfile: PropTypes.shape()
};

function mapStateToProps (state) {
    return {
        balance: selectBalance(state),
        loggedProfile: state.profileState.get('loggedProfile')
    };
}

export default connect(
    mapStateToProps
)(injectIntl(MyBalance));
