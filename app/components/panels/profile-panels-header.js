import React from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import Link from 'react-router-dom/Link';
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import { Row, Col } from 'antd';
import { generalMessages } from '../../locale-data/messages';

const beautifyName = (name) => {
    switch (name) {
        case 'editProfile':
            return 'Edit Profile';
        case 'lists':
            return 'Lists';
        case 'settings':
            return 'Settings';
        default:
            return name;
    }
};

const createLink = (href, text) =>
  <Link to={href}>{text}</Link>;

const crumbifyPath = (match) => {
    const { params } = match;
    if (params.others.includes('/')) {
        return params.others
            .split('/')
            .map((part, index, arr) => {
                if (index < arr.length - 1) {
                    return (
                      <span key={part}>
                        <ArrowRight style={{ height: 18, verticalAlign: 'middle' }} />
                        {createLink('default', beautifyName(part))}
                      </span>
                    );
                }
                return (
                  <span>
                    <ArrowRight style={{ height: 18, verticalAlign: 'middle' }} />
                    {beautifyName(part)}
                  </span>
                );
            });
    }
    return (
      <span>
        <ArrowRight style={{ height: 18, verticalAlign: 'middle' }} />
        {createLink(params.others, params.others)}
      </span>
    );
};
const createBreadCrumbs = ({ loginName, match, location }) => {
    const { params } = match;
    let breadCrumb = <span>{createLink('uprofile', loginName)}</span>;
    if (params.panelName === 'uprofile') {
        breadCrumb = <span>{loginName}</span>;
    }
    if (params.panelName !== 'uprofile') {
        breadCrumb = (
          <span>
            {
              createLink('uprofile', loginName)
            } <ArrowRight style={{ height: 18, verticalAlign: 'middle' }} /> {
              params.others ?
                createLink(`${params.panelName}`, beautifyName(params.panelName)) :
                beautifyName(params.panelName)
            } {params.others && crumbifyPath(match, location)}
          </span>
        );
    }
    return breadCrumb;
};

const ProfilePanelsHeader = (props) => {
    const { loginName, onPanelNavigate,
        onLogout, canEditProfile, intl } = props;
    return (
      <div style={{ height: 48, background: '#FAFAFA', padding: '0 24px' }}>
        <Row type="flex" align="middle" justify="center">
          <Col span={16}>
            <div style={{ lineHeight: '48px' }}>
              <Route
                path="/:rootPath+/panel/:panelName/:others*"
                render={
                  ({ match, location }) => {
                      if (!canEditProfile && match.params.panelName === 'editprofile') {
                          return <span>{loginName} > <b>{intl.formatMessage(generalMessages.completeProfileCrumb)}</b></span>;
                      }
                      return createBreadCrumbs({ match, location, loginName });
                  }
                }
              />
            </div>
          </Col>
          <Col span={8}>
            <Row type="flex" justify="end">
              <Col
                span={8}
                className="link-button"
                style={{ textAlign: 'center' }}
                onClick={onPanelNavigate('settings')}
              >
                Settings
              </Col>
              {canEditProfile &&
                <Col
                  span={8}
                  className="link-button"
                  style={{ textAlign: 'center' }}
                  onClick={onPanelNavigate('editProfile')}
                >
                  Edit profile
                </Col>
              }
              <Col
                span={8}
                className="link-button"
                style={{
                    textAlign: 'center'
                }}
                onClick={onLogout}
              >
                Logout
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
    loginName: PropTypes.string,
    onLogout: PropTypes.func,
    onPanelNavigate: PropTypes.func,
};

export default ProfilePanelsHeader;
