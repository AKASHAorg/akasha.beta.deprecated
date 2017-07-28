import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card } from 'antd';
import { profileMessages } from '../../locale-data/messages';

class UserProfileDetails extends PureComponent {
    render () {
        const { balance, intl, loggedProfileData, onPanelNavigate } = this.props;

        return (
          <Row type="flex" className="user-profile-details">
            <Col span={15} className="user-profile-details_leftCol">
              <Card className="user-profile-details_card">
                <Row type="flex">
                  <Col span={18}>{intl.formatMessage(profileMessages.myBalance)}</Col>
                  <Col span={6} className="send-receive-buttons">
                    <a href="/wallet" onClick={onPanelNavigate('wallet')}>
                      {intl.formatMessage(profileMessages.send)}
                    </a>
                    <a href="/wallet" onClick={onPanelNavigate('wallet')}>
                      {intl.formatMessage(profileMessages.receive)}
                    </a>
                  </Col>
                  <Col span={24} >
                    <div className="user-profile-details_balance">
                      <span className="balance-currency">ETH</span>
                      <span className="balance-value"> {balance}</span>
                    </div>
                  </Col>
                </Row>
              </Card>
              <Card className="user-profile-details_card">
                <Row type="flex">
                  <Col span={24}>{intl.formatMessage(profileMessages.contacts)}</Col>
                </Row>
              </Card>
            </Col>
            <Col span={9} className="user-profile-details_rightCol">
              <Card className="user-profile-details_card followers-card">
                <Row type="flex">
                  <Col span={10}>
                    <div className="followers-label">{intl.formatMessage(profileMessages.followers)}</div>
                    <div>
                      <b>
                        {loggedProfileData.get('followersCount')}
                      </b>
                    </div>
                  </Col>
                  <Col span={10}>
                    <div className="followings-label">{intl.formatMessage(profileMessages.followings)}</div>
                    <div>
                      <b>
                        {loggedProfileData.get('followingCount')}
                      </b>
                    </div>
                  </Col>
                </Row>
              </Card>
              <Card className="user-profile-details_card">
                <Row>
                  <Col span={24}>{intl.formatMessage(profileMessages.lists)}</Col>
                  <Col span={10}>
                    <div>Public</div>
                    <div>12</div>
                  </Col>
                  <Col span={10} />
                </Row>
              </Card>
            </Col>
          </Row>
        );
    }
}

UserProfileDetails.propTypes = {
    balance: PropTypes.string,
    intl: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    onPanelNavigate: PropTypes.func,
}

export default UserProfileDetails;
