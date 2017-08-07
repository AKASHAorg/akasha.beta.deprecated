import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import { Row, Col } from 'antd';
import { generalMessages } from '../../locale-data/messages';
import { Breadcrumbs, PanelLink } from '../';

const ProfilePanelsHeader = (props) => {
    const { canEditProfile, location, loginName, match, onLogout, intl } = props;

    if (!location.pathname.includes('/panel')) {
        return null;
    }

    return (
      <div style={{ height: 48, background: '#FAFAFA', padding: '0 24px' }}>
        <Row type="flex" align="middle" justify="center">
          <Col span={16}>
            <div style={{ lineHeight: '48px' }}>
              {!canEditProfile && match.params.panelName === 'editprofile' ?
                <span>
                  {loginName} &gt;
                    <b>{intl.formatMessage(generalMessages.completeProfileCrumb)}</b>
                </span> :
                <Breadcrumbs panel />
              }
            </div>
          </Col>
          <Col span={8}>
            <Row type="flex" justify="end">
              <Col
                span={8}
                className="link-button"
                style={{ textAlign: 'center' }}
              >
                <PanelLink to="settings">
                  {intl.formatMessage(generalMessages.settings)}
                </PanelLink>
              </Col>
              {canEditProfile &&
                <Col
                  span={8}
                  className="link-button"
                  style={{ textAlign: 'center' }}
                >
                  <PanelLink to="editProfile">
                    {intl.formatMessage(generalMessages.editProfile)}
                  </PanelLink>
                </Col>
              }
              <Col
                span={8}
                className="link-button"
                style={{ textAlign: 'center' }}
                onClick={onLogout}
              >
                {intl.formatMessage(generalMessages.logout)}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
};

ProfilePanelsHeader.propTypes = {
    canEditProfile: PropTypes.bool,
    intl: PropTypes.shape(),
    location: PropTypes.shape(),
    loginName: PropTypes.string,
    match: PropTypes.shape(),
    onLogout: PropTypes.func,
};

export default withRouter(ProfilePanelsHeader);
